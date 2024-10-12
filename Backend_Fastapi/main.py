from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import create_engine
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date
import pyodbc
from typing import Any
import jwt
from datetime import datetime

from datetime import date

# from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from model import Employee
from model import Department, EmployeeProjects, Leaves, typeOfLeave, Timesheet, Ticket, EmployeeProjects, TimesheetApproval, Alert
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from sqlalchemy import extract
from sqlalchemy import update


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLALCHEMY_DATABASE_URL = 'mssql+pyodbc://@93RRLQ2\SQLEXPRESS/Timesheet_Database?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Replace with your secret key
SECRET_KEY = "your_secret_key"


from pydantic import BaseModel

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


class TimesheetBase(BaseModel):
    timesheet_id: Optional[int] = None
    start_time: datetime
    end_time: datetime
    task_name: str
    project_id: int
    employee_id: int
    manager_id: int
    status: int
    # created_by: int
    # created_date: datetime
    # modified_by: int
    # modify_date: datetime
    # isactive: int


class TicketBase(BaseModel):
    # ticket_id: int 
    create_at: date
    description: str
    status: int
    creator_id: int
    project_id: int
    ref_employee_id: int
    created_by: int
    created_date: date
    modified_by: int
    modify_date: date
    isactive: int

    class Config:
        orm_mode = True


class AlertBase(BaseModel):
    alt_id: Optional[int]
    alert_name: Optional[str]
    employee_id: int
    status: Optional[int] = 0


class userBase(BaseModel):
    emp_id: Optional[int] = None
    manager_id: Optional[int] = None
    ap_id: Optional[int] = None
    
    

def create_access_token(data: dict):
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token: str, db: Session = Depends(get_db)):
    # try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    empid = payload.get("empid")
    # print(type(empid))
    user = db.query(Employee).filter(Employee.empid == empid).first()
        # print(user)
        # if user:
        #     return user
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Invalid token")


class passReq(BaseModel):
    id: int
    key: str

@app.post("/login")
async def login(request: passReq, db: Session = Depends(get_db)):
    # Authenticate the user (replace with your authentication logic)
    # sql='SELECT TOP 1 * FROM Employee'

    # data = await request.json()
    id=request.id
    password=request.key
    # print(data)
    
    authenticated_user= db.query(Employee).filter(Employee.empid == id, Employee.password == password).first()
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
    # print(access_token)
    # return result_list
    return access_token
    

@app.get("/protected/getEmployee/employee")
def protected_endpoint(current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):

    results = db.query(Employee, EmployeeProjects).join(Employee, Employee.empid == EmployeeProjects.employee_id)


    result_list = []
    for department, employee in results:
        result_list.append({
            "department_name": department.name,
            "employee_name": employee.name
        })
    
    return result_list




@app.post("/getTimesheetDataByUser")
def get_timsheet_data_by_user(current_user: userBase, db: Session = Depends(get_db)):
    emp_id=current_user.emp_id

    timsheet_data_user = db.query(Timesheet).filter(Timesheet.employee_id == emp_id).all()
    if not timsheet_data_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for timesheet in timsheet_data_user:
        # result_list.append({
        #     "timesheet_id": timesheet.timesheet_id,
        #     "start_time": timesheet.start_time
        # })
        # date_object = datetime.strptime(timesheet.start_time, "%Y-%m-%d %H:%M:%S")
        # formatted_date = date_object.strftime("%Y-%m-%dT%H:%M:%S")
        # print(formatted_date)

        result_list.append({
            "id": timesheet.timesheet_id,
            "start": timesheet.start_time.strftime("%Y-%m-%dT%H:%M:%S"),#.strftime("%Y-%m-%dT%H:%M:%S"),  # Format datetime
            "end": timesheet.end_time.strftime("%Y-%m-%dT%H:%M:%S"),#.strftime("%Y-%m-%dT%H:%M:%S"),  # Format datetime
            "text": timesheet.task_name,
            "project": timesheet.project_id,
            "employee_id": timesheet.employee_id,
            "status": timesheet.status,
            "manager_id":timesheet.manager_id
            # "created_by": timesheet.created_by,
            # "created_date": timesheet.created_date.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            # "modified_by": timesheet.modified_by,
            # "modify_date": timesheet.modify_date.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            # "isactive": timesheet.isactive
        })
    
    return result_list

@app.post("/getTimesheetApprovalRequestByManager")
def get_timesheet_data_by_manager(current_user: userBase, db: Session = Depends(get_db)):
    manager_id=current_user.manager_id

    timsheet_data_user = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id)

    if not timsheet_data_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for timesheet in timsheet_data_user:
        # result_list.append({
        #     "timesheet_id": timesheet.timesheet_id,
        #     "start_time": timesheet.start_time
        # })
        result_list.append({
            "ap_id": timesheet.ap_id,
            "created_at": timesheet.created_at.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            "employee_id": timesheet.employee_id,
            "status": timesheet.status,
            # "employee_id": timesheet.employee_id,
            # "status": timesheet.status,
            # "manager_id":timesheet.manager_id
            # "created_by": timesheet.created_by,
            # "created_date": timesheet.created_date.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            # "modified_by": timesheet.modified_by,
            # "modify_date": timesheet.modify_date.strftime("%Y-%m-%d %H:%M:%S"),  # Format datetime
            # "isactive": timesheet.isactive
        })
    
    return result_list




@app.post("/postTimesheetApproveReq")
async def post_approve_req(req:userBase,db: Session = Depends(get_db)):
    ap_id=req.ap_id

    ticket_data_Refuser = db.query(TimesheetApproval).filter(TimesheetApproval.ap_id == ap_id).first()

    print(ticket_data_Refuser.ap_id)

    if not ticket_data_Refuser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    ticket_data_Refuser.status=2

    db.commit()
    # db.refresh(ticket_data_Refuser)
    
    return 1


@app.post("/postTimesheetRejectReq")
async def post_reject_req(req:userBase,db: Session = Depends(get_db)):
    ap_id=req.ap_id

    ticket_data_Refuser = db.query(TimesheetApproval).filter(TimesheetApproval.ap_id == ap_id).first()
    print(ticket_data_Refuser.ap_id)


    if not ticket_data_Refuser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    ticket_data_Refuser.status=3

    db.commit()
    # db.refresh(ticket_data_Refuser)
    
    return 1


@app.post("/postTimesheetDataByUser")
def post_timesheet_data(newEntry: TimesheetBase, db: Session = Depends(get_db)):
    emp_id=newEntry.employee_id
    print(newEntry.dict())  # Debug print
    timesheet_Record = Timesheet(**newEntry.dict())

    db.add(timesheet_Record)
    db.commit()
    db.refresh(timesheet_Record)

    return timesheet_Record


class approvalBase(BaseModel):
    ap_id:Optional[int] = None
    employee_id:int
    manager_id:int
    status:Optional[int]=1
    created_at:Optional[datetime]=datetime.now()


@app.post("/addTimesheetForApproval")
def timesheet_approval(newEntry: approvalBase, db: Session = Depends(get_db)):
    timesheet_Record = TimesheetApproval(**newEntry.dict())

    db.add(timesheet_Record)
    db.commit()
    db.refresh(timesheet_Record)

    return timesheet_Record


@app.get("/getTicketDataByUser")
def get_ticket_data(current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):
    emp_id=current_user.empid

    ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

    if not ticket_data_Creatoruser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for ticket in ticket_data_Creatoruser:
        result_list.append({
            "ticket_id": ticket.ticket_id,
            "create_at": ticket.create_at,
            "description": ticket.description,
            "status": ticket.status,
            "ref_employee_id": ticket.ref_employee_id
        })
    
    return result_list




@app.delete("/deleteTimesheetData")
async def delete_items_by_condition(req: userBase, db: Session = Depends(get_db)):

    emp_id=req.emp_id

    # items_to_delete = db.query(Timesheet).filter((
    #     Timesheet.employee_id=emp_id,
    #     # Timesheet.start_time
    # )).all()


    query = db.query(Timesheet).filter(
        Timesheet.employee_id == emp_id,
        extract('month', Timesheet.start_time) == extract('month', datetime.now()),
        extract('year', Timesheet.start_time) == extract('year', datetime.now())
    )

    items_to_delete = query.all()


    
    if items_to_delete:
        for item in items_to_delete:
            db.delete(item)
        db.commit()
        return {"message": "Items deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Items not found")




@app.post("/postTicketDataByUser")
def post_timesheet_data(newEntry: TicketBase, current_user: EmployeeBase = Depends(verify_token), db: Session = Depends(get_db)):
    emp_id=current_user.empid

    ticket_Record = Ticket(**newEntry.dict())

    db.add(ticket_Record)
    db.commit()
    db.refresh(ticket_Record)

    return ticket_Record


class RequestBody(BaseModel):
    id:int


@app.post("/getTicketDataByUser")
async def get_ticket_data(req:RequestBody, db: Session = Depends(get_db)):


    # emp_id=current_user.empid
    # print(req)
    # data=await request.json()
    # print(data)
    # emp_id=data.get("id")
    emp_id=req.id
    # token=req.token
    
    # payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    # empid = payload.get("empid")
    # print(type(empid))
    # user = db.query(Employee).filter(Employee.empid == empid).first()
    # print(user)

    ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

    if not ticket_data_Creatoruser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for ticket in ticket_data_Creatoruser:
        result_list.append({
            "ticket_id": ticket.ticket_id,
            "create_at": ticket.create_at,
            "description": ticket.description,
            "status": ticket.status,
            "project_id":ticket.project_id,
            "ref_employee_id": ticket.ref_employee_id
        })
    
    return result_list


@app.post("/getTicketDataByRefUser")
async def get_ticket_by_refuser(req:RequestBody, db: Session = Depends(get_db)):
    emp_id=req.id

    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

    if not ticket_data_Refuser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for ticket in ticket_data_Refuser:
        result_list.append({
            "ticket_id": ticket.ticket_id,
            "ref_employee_id": ticket.ref_employee_id,
            "creator_id": ticket.creator_id,
            "description": ticket.description,
            "project_id": ticket.project_id,
            "create_at": ticket.create_at,
            "status": ticket.status,
        })
    
    return result_list


@app.post("/updateTicketDataToDone")
async def update_ticket_done(req:RequestBody, db: Session = Depends(get_db)):
    tick_id=req.id

    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ticket_id == tick_id).first()

    # print(ticket_data_Refuser.ticket_id)
    # if not ticket_data_Refuser:
    #     raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    # ticket_data_Refuser.status=1

    # db.commit()

    stmt = (
        update(Ticket)
        .where(Ticket.ticket_id == tick_id)
        .values(status=1)
    )

    # ticket_data_user = db.query(Ticket).filter(Ticket.ticket_id == tick_id).all()
    
    # if not ticket_data_user:
    #     raise HTTPException(status_code=404, detail="Ticket not found")
    
    # # Update the first matching row
    # for ticket in ticket_data_user:
    #     ticket.status = 1
    # ticket_data_Refuser.status = 1 #// ticket_data_Refuser.new_status
    db.execute(stmt)
    
    db.commit()
    # db.refresh(ticket_data_Refuser)
    # db.refresh(Ticket)
    
    return 1


@app.post("/fetchProjectsForEmployee")
async def get_ticket_by_refuser(req:RequestBody, db: Session = Depends(get_db)):
    emp_id=req.id

    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    ticket_data_Refuser = db.query(Leaves) #.filter(EmployeeProjects.employee_id == emp_id)

    if not ticket_data_Refuser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for ticket in ticket_data_Refuser:
        result_list.append({
            "employee_id": ticket.employee_id,
            "project_id": ticket.project_id,
        })
    
    return result_list
    # return 0


class addTicketBase(BaseModel):
    ticket_id: int 
    create_at: date
    description: str
    status: int
    creator_id: int
    project_id: int
    ref_employee_id: int

@app.post("/addTicketDataToTable")
async def update_ticket_donee(req:addTicketBase, db: Session = Depends(get_db)):
    db_item=Ticket(**req.dict())
    db.add(db_item)
    db.commit()

    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ticket_id == tick_id)


    

    # if not ticket_data_Refuser:
    #     raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    # ticket_data_Refuser.status=1

    # db.commit()
    # db.refresh(Ticket)
    
    return 1


@app.post("/getLeaveDataByUser")
def get_leaves(request: userBase, db: Session = Depends(get_db)):
    try:
        leave_records = db.query(Leaves).all()
        # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

        if not leave_records:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        for leave in leave_records:
            result_list.append({
                "leave_id": leave.leave_id,
                "start_date": leave.start_time,
                "end_date": leave.end_time,
                "reason": leave.reason,
                "type": leave.t_id,
                "status": leave.status,
            })
        
        return result_list
    except Exception as e:
        print("Exception : ", e)




@app.post("/getLeavesRemaining")
def get_leave_remaining(req:userBase, db: Session = Depends(get_db)):
    emp_id=req.emp_id

    leave_remaining = db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

    if not leave_remaining:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for ticket in leave_remaining:
        result_list.append({
            "employee_id": ticket.employee_id,
            "t_id":ticket.t_id,
            "t_days":ticket.t_days,
            "balance":ticket.balance
        })
    
    return result_list

class updateRemBase(BaseModel):
    emp_id:int
    t_id:int
    days:int


# @app.post("/updateRemainingLeaves")
# def update_rem_leaves(req:updateRemBase, db: Session = Depends(get_db)):
#     emp_id=req.emp_id,
#     t_id=req.t_id,
#     days=req.days
#     update_rem_leaves=db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id, typeOfLeave.t_id==t_id).one()
#     # leave_remaining = db.query(typeOfLeave).filter(typeOfLeave.employee_id == emp_id).first()

#     if not update_rem_leaves:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")


#     # for row in update_rem_leaves:
#     print(update_rem_leaves.t_id)
#     # dys=update_rem_leaves.t_days
#     # update_rem_leaves.t_days=dys-days

#     # db.commit()

#     return 1

@app.post("/updateRemainingLeaves")
def get_leave(request: updateRemBase, db: Session = Depends(get_db)):
    try:
        leave_record = db.query(typeOfLeave).filter(typeOfLeave.employee_id == request.emp_id, typeOfLeave.t_id == request.t_id).one()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Leave record not found")

    employee_id = leave_record.t_days

    hdf=leave_record.t_days
    leave_record.t_days=hdf-request.days
    db.commit()
    return {"employee_id": employee_id, "leave_record": leave_record}

class LeaveRequestBase(BaseModel):
    leave_id: Optional[int] = None
    start_time: str
    end_time: str
    reason: str
    t_id: int
    status: int
    manager_id: int
    employee_id:int



@app.post("/addLeaveDataToTable")
async def push_leave_data_to_table(req:LeaveRequestBase, db: Session = Depends(get_db)):
    db_item=Leaves(**req.dict())
    db.add(db_item)
    db.commit()

    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ticket_id == tick_id)


    

    # if not ticket_data_Refuser:
    #     raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    # ticket_data_Refuser.status=1

    # db.commit()
    # db.refresh(Ticket)
    
    return 1


@app.post("/getLeaveDataByManager")
def get_leave_data_by_user(req:RequestBody, db: Session = Depends(get_db)):
    try:
        emp_id=req.id

        leave_data_Creatoruser = db.query(Leaves).filter(Leaves.manager_id == emp_id).all()
        # ticket_data_Refuser = db.query(Ticket).filter(Ticket.ref_employee_id == emp_id)

        if not leave_data_Creatoruser:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        result_list = []
        for leave in leave_data_Creatoruser:
            result_list.append({
                "leave_id": leave.leave_id,
                "employee_id": leave.employee_id,
                "start_date": leave.start_time,
                "end_date": leave.end_time,
                "reason": leave.reason,
                "type": leave.t_id,
                "status": leave.status,
            })
        
        return result_list
    except Exception as e:
        print("Exception : ", e)


class updateLeaveBase(BaseModel):
    id:int
    status:int
@app.post("/updateLeaveDataToDoneorReject")
async def update_ticket_done(req:updateLeaveBase, db: Session = Depends(get_db)):
    id=req.id
    status=req.status
    # ticket_data_Creatoruser = db.query(Ticket).filter(Ticket.creator_id == emp_id)
    ticket_data_Refuser = db.query(Leaves).filter(Leaves.leave_id == id).first()


    if not ticket_data_Refuser:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    ticket_data_Refuser.status=status

    db.commit()
    # db.refresh(Ticket)
    
    return 1



@app.post("/addAlerts")
async def add_alerts(req:AlertBase, db: Session = Depends(get_db)):
    add_item=Alert(**req.dict())

    if not add_item:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    db.add(add_item)
    db.commit()
    db.refresh(add_item)
    
    return 1
@app.post("/updateAlerts")
async def update_alerts(req:AlertBase, db: Session = Depends(get_db)):
    alt_id=req.alt_id

    change_alert=db.query(Alert).filter(Alert.alt_id == alt_id).first()

    if not change_alert:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    change_alert.status=1
    
    db.commit()

    return 1

@app.post("/getProjectDataByuser")
async def get_project_data(req:userBase, db: Session = Depends(get_db)):
    emp_id=req.emp_id

    project_list=db.query(EmployeeProjects).filter(EmployeeProjects.employee_id == emp_id).all()


    if not project_list:
       raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for project in project_list:
        result_list.append({
            "project_id":  project.project_id
        })
    
    return result_list


