from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    existing = db.query(models.Employee).filter(
        (models.Employee.employee_id == employee.employee_id) |
        (models.Employee.email == employee.email)
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")

    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def get_employees(db: Session):
    return db.query(models.Employee).all()


def delete_employee(db: Session, employee_id: int):
    employee = db.query(models.Employee).get(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()