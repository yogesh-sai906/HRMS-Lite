from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date
from .. import models, schemas


def mark_attendance(db: Session, att: schemas.AttendanceCreate):
    employee = db.query(models.Employee).filter(models.Employee.employee_id == att.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    status = att.status.capitalize()
    if status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Status must be Present or Absent")

    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee.id,
        models.Attendance.date == att.date
    ).first()

    if existing:
        existing.status = status
        message = "Attendance updated"
    else:
        attendance = models.Attendance(employee_id=employee.id, date=att.date, status=status)
        db.add(attendance)
        message = "Attendance marked"

    db.commit()
    return {"message": message}


def get_attendance_for_employee(db: Session, employee_id: str):
    employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    records = db.query(models.Attendance).filter(models.Attendance.employee_id == employee.id).order_by(models.Attendance.date.desc()).all()

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


def get_today_present(db: Session):
    today = date.today()
    records = (
        db.query(
            models.Employee.employee_id,
            models.Employee.full_name,
            models.Employee.department,
        )
        .join(models.Attendance, models.Attendance.employee_id == models.Employee.id)
        .filter(models.Attendance.date == today, models.Attendance.status == "Present")
        .distinct()
        .all()
    )

    return [
        {"employee_id": r.employee_id, "full_name": r.full_name, "department": r.department}
        for r in records
    ]
