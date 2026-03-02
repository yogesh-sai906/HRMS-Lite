from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import schemas
from ..services import attendance_service, employee_service

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
    return attendance_service.mark_attendance(db, att)

@router.get("/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    return attendance_service.get_attendance_for_employee(db, employee_id)

@router.get("/today/present")
def get_today_present_employees(db: Session = Depends(get_db)):
    return attendance_service.get_today_present(db)
