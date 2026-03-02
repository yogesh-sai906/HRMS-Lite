from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import schemas
from ..services import employee_service

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.EmployeeResponse)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create_employee(db, employee)

@router.get("/", response_model=list[schemas.EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return employee_service.get_employees(db)

@router.delete("/{employee_id}")
def remove_employee(employee_id: int, db: Session = Depends(get_db)):
    employee_service.delete_employee(db, employee_id)
    return {"message": "Employee deleted successfully"}


@router.get("/counts")
def get_employee_counts(db: Session = Depends(get_db)):
    """Return count of total employees."""
    total = employee_service.count_employees(db)
    return {"total_users": total}