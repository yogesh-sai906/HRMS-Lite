from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def mark_attendance(
    att: schemas.AttendanceCreate,
    db: Session = Depends(get_db)
):
    # Resolve employee by business employee_id
    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == att.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Normalize & validate status
    status = att.status.capitalize()
    if status not in ["Present", "Absent"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Present or Absent"
        )

    # Check if attendance already exists for this date
    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee.id,
        models.Attendance.date == att.date
    ).first()

    # Update if exists, else create
    if existing_attendance:
        existing_attendance.status = status
        message = "Attendance updated"
    else:
        attendance = models.Attendance(
            employee_id=employee.id,
            date=att.date,
            status=status
        )
        db.add(attendance)
        message = "Attendance marked"

    db.commit()

    return {"message": message}

@router.get("/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee.id
    ).order_by(models.Attendance.date.desc()).all()

    return [
        {
            "id": r.id,
            "full_name": employee.full_name,
            "employee_id": employee.employee_id, 
            "date": r.date,
            "status": r.status,
        }
        for r in records
    ]

@router.get("/today/present")
def get_today_present_employees(db: Session = Depends(get_db)):
    today = date.today()

    records = (
        db.query(
            models.Employee.employee_id,
            models.Employee.full_name,
            models.Employee.department
        )
        .join(models.Attendance, models.Attendance.employee_id == models.Employee.id)
        .filter(
            models.Attendance.date == today,
            models.Attendance.status == "Present"
        )
        .distinct()
        .all()
    )

    return [
        {
            "employee_id": r.employee_id,
            "full_name": r.full_name,
            "department": r.department,
        }
        for r in records
    ]
