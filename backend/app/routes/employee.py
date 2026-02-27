from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import schemas, crud

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.EmployeeResponse)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)

@router.get("/", response_model=list[schemas.EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@router.delete("/{employee_id}")
def remove_employee(employee_id: int, db: Session = Depends(get_db)):
    crud.delete_employee(db, employee_id)
    return {"message": "Employee deleted successfully"}