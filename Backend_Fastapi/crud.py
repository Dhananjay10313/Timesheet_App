
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
import jwt
from model import Employee, Department, EmployeeProjects
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
  # Replace with your frontend's origin
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your SQL Server connection string
# SQLALCHEMY_DATABASE_URL = "mssql+pymssql://RA-INT\\DSingh25:@93RRLQ2\\SQLEXPRESS:1433/Timesheet_Database"
SQLALCHEMY_DATABASE_URL = 'mssql+pyodbc://@93RRLQ2\SQLEXPRESS/Timesheet_Database?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



SECRET_KEY = "your_secret_key"



Base = declarative_base()



# Define a model for user data
# class Employee(Base):
#     __tablename__ = "employee"

#     empid = Column(Integer, primary_key=True)
#     name = Column(String)
#     role = Column(String)
#     password = Column(Integer)  # Consider using a more secure password hashing mechanism
#     manager_id = Column(Integer)
#     department_id = Column(Integer)
#     created_by = Column(Integer)
#     created_date = Column(Date)
#     modified_by = Column(Integer)
#     modify_date = Column(Date)
#    isactive = Column(Integer)

# @app.get("/emp")
# def bring(db: Session = Depends(get_db)):
    
#     results = db.query(Employee, EmployeeProjects).join(Employee, Employee.empid == EmployeeProjects.employee_id)

#     # print(result)
#     result_list = []
#     for department, employee in results:
#         result_list.append({
#             "department_name": department.name,
#             "employee_name": employee.name
#         })
#         # print(result_list[-1])

#     return result_list



class EmployeeBase(BaseModel):
    empid: int
    name: str
    role: str
    password: str  # Placeholder for hashed password
    manager_id: int | None  # Optional, as manager_id can be null
    department_id: int
    created_by: int
    created_date: date
    modified_by: int
    modify_date: date
    isactive: bool


def create_access_token(data: dict):
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        empid = payload.get("empid")
        user = db.query(Employee).filter(Employee.empid == empid).first()
        if user:
            return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login")
def login(employee: EmployeeBase, db: Session = Depends(get_db)):
    # Authenticate the user (replace with your authentication logic)
    # sql='SELECT TOP 1 * FROM Employee'

    authenticated_user= db.query(Employee).filter(Employee.empid == employee.empid, Employee.password == employee.password).first()
    # authenticated_user = db.query(Department, Employee).join(Employee, Department.dep_id == Employee.department_id)

    # result_list = []
    # for department, employee in authenticated_user:
    #     result_list.append({
    #         "department_name": department.name,
    #         "employee_name": employee.name
    #     })
    #     print(result_list[-1])
    
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # Create an access token
    access_token = create_access_token({"empid": authenticated_user.empid})
    # return result_list