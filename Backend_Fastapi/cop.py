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
from model import Department, EmployeeProjects, Leaves, typeOfLeave, Timesheet, Ticket, EmployeeProjects, TimesheetApproval, Alert, Project
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from sqlalchemy import extract, text
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
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    password: Optional[str] = None
    
    

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



# @app.post("/addAlerts")
# async def add_alerts(req:AlertBase, db: Session = Depends(get_db)):
#     add_item=Alert(**req.dict())

#     if not add_item:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
    
#     db.add(add_item)
#     db.commit()
#     db.refresh(add_item)
    
#     return 1


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

from datetime import datetime, timedelta

@app.post("/getHrsWorkedPerDay")
def get_timesheets(req: userBase, db: Session = Depends(get_db)):
    # timesheets = db.query(Timesheet).filter(
    #     Timesheet.manager_id ==req.manager_id,
    #     Timesheet.start_time >= req.start_time,
    #     Timesheet.end_time <= req.end_time
    # ).all()
    timesheets = db.execute(text("SELECT * FROM timesheet WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 ORDER BY timesheet.start_time"), {'user_id': req.manager_id, "time1":req.start_time, "time2":req.end_time}).fetchall()

    if not timesheets:
        raise HTTPException(status_code=404, detail="Timesheets not found")

    hours_per_day = {}
    for timesheet in timesheets:
        day = timesheet.start_time.date()
        hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
        if day in hours_per_day:
            hours_per_day[day] += hours_worked
        else:
            hours_per_day[day] = hours_worked

    return hours_per_day

#search
@app.post("/getApprovedVsRecieved")
def get_approve_vs_recieved(req: userBase, db: Session = Depends(get_db)):
    manager_id=req.manager_id

    total_received = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id,TimesheetApproval.created_at >= req.start_time,
        TimesheetApproval.created_at <= req.end_time).count()

    total_approved = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id,TimesheetApproval.status==2,TimesheetApproval.created_at >= req.start_time,
        TimesheetApproval.created_at <= req.end_time).count()
    
    total_rejected = db.query(TimesheetApproval).filter(TimesheetApproval.manager_id == manager_id,TimesheetApproval.status==3,TimesheetApproval.created_at >= req.start_time,
        TimesheetApproval.created_at <= req.end_time).count()

    
    return {
        "total_received":total_received,
        "total_rejected":total_rejected,
        "total_approved":total_approved
    }


@app.post("/getTotalCompanyHrsVsTeamsHrs")
def get_company_vs_team(req: userBase, db: Session = Depends(get_db)):
    # print(req)
    # return req
    timesheets = db.query(Timesheet).filter(
        Timesheet.manager_id ==req.manager_id,
        Timesheet.start_time >= req.start_time,
        Timesheet.end_time <= req.end_time
    ).all()

    company_timesheets = db.query(Timesheet).filter(
        Timesheet.start_time >= req.start_time,
        Timesheet.end_time <= req.end_time
    ).all()

    if not timesheets:
        raise HTTPException(status_code=404, detail="Timesheets not found")

    team_worked_hrs=0
    for timesheet in timesheets:
        day = timesheet.start_time.date()
        hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
        team_worked_hrs+=hours_worked

    company_worked_hrs=0
    for timesheet in company_timesheets:
        day = timesheet.start_time.date()
        hours_worked = (timesheet.end_time - timesheet.start_time).total_seconds() / 3600
        company_worked_hrs+=hours_worked
        # print(hours_worked)

    return {
        "team_worked_hrs":team_worked_hrs,
        "company_worked_hrs":company_worked_hrs
    }



@app.post("/getLeave_today")
def get_leave_today(req: userBase, db: Session = Depends(get_db)):

    leaves_today = db.query(Leaves).filter(
        Leaves.manager_id ==req.manager_id,
        Leaves.start_time >= req.start_time,
        Leaves.end_time <= req.end_time
    ).count()

    if not leaves_today:
        raise HTTPException(status_code=404, detail="Timesheets not found")
    
    return {"leaves_today":leaves_today}


def calculate_hours(start, end):
    start_dt = datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(end, "%Y-%m-%d %H:%M:%S")
    return (end_dt - start_dt).total_seconds() / 3600



@app.post("/getEmployeeTimesheetDataWithRole")
def get_employee_timesheet_role(req: userBase, db: Session = Depends(get_db)):
    join_data = db.execute(text("SELECT * FROM employee JOIN timesheet ON employee.empid = timesheet.employee_id WHERE timesheet.manager_id = :user_id and timesheet.start_time>= :time1 and timesheet.end_time<= :time2 ORDER BY timesheet.start_time"), {'user_id': req.manager_id, "time1":req.start_time, "time2":req.end_time}).fetchall()


    aggregated_data={}
    for entry in join_data:
        day = entry.start_time.date()
        role = entry.role
        hours = (entry.end_time - entry.start_time).total_seconds() / 3600
        # if day in aggregated_data:
        #     if role in aggregated_data[day]:
        #         aggregated_data[day][role]+=hours
        #     else:
        #         aggregated_data[day][role]=hours
        # else:
        #     aggregated_data[day][role] = hours

        if day not in aggregated_data:
            aggregated_data[day] = {}  # Initialize the day key with an empty dictionary
        
        if role in aggregated_data[day]:
            aggregated_data[day][role] += hours
        else:
            aggregated_data[day][role] = hours

    # result_list=[]
    # for data in join_data:
    #     result_list.append({
    #         "employee_id":data.empid,
    #         "role":data.role
    #     })
    return aggregated_data



@app.post("/calculateHoursProject")
def calculate_hours_projects(req: userBase, db: Session = Depends(get_db)):
    project_hours={}
    timesheet_entries = db.query(Timesheet).filter(
        Timesheet.manager_id ==req.manager_id,
        Timesheet.start_time >= req.start_time,
        Timesheet.end_time <= req.end_time
    ).all()

    for entry in timesheet_entries:
        hours_worked = (entry.end_time - entry.start_time).total_seconds() / 3600
        if entry.project_id in project_hours:
            project_hours[entry.project_id] += hours_worked
        else:
            project_hours[entry.project_id] = hours_worked

    return project_hours



from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
# from passlib.context import CryptContext
from pydantic import BaseModel

# to get a string like this run:
# openssl rand -hex 32

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
async def login_for_access_token(
    request: passReq,
    db: Session = Depends(get_db)
) -> Token:
    
    id=request.id
    password=request.key
    # print(data)
    
    user= db.query(Employee).filter(Employee.empid == id, Employee.password == password).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.empid}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    return "ok"

@app.post("/getUserInfo")
async def ret_one(req: userBase, current_user: Annotated[str, Depends(get_current_user)], db: Session = Depends(get_db)):
    authenticated_user= db.query(Employee).filter(Employee.empid == req.emp_id, Employee.password == req.password).first()

    return {
        "emp_id":authenticated_user.empid,
        "manager_id":authenticated_user.manager_id,
        "is_manager":authenticated_user.ismanager
    }
    

class projectAddBase(BaseModel):
    description: str
    start_date: date
    deadline: date
    employee_count: int
    manager_id: int


@app.post("/addProjectData")
def add_project_data(req: projectAddBase, db: Session = Depends(get_db)):
    add_item=Project(**req.dict())
    print(req)

    if not add_item:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    db.add(add_item)
    db.commit()
    db.refresh(add_item)
    
    return 1


@app.post("/getProjectDataByManagerId")
async def get_manager_project(req: userBase, db: Session = Depends(get_db)):
    id=req.manager_id

    project_list=db.query(Project).filter(Project.manager_id == id).all()


    if not project_list:
       raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for project in project_list:
        result_list.append({
            "project_id":  project.project_id,
            "description": project.description,
            "startTime": project.start_date,
            "deadline": project.deadline,
            "employeeCount" : project.employee_count
        })
    
    return result_list


@app.post("/getEmployeeInfoByManger")
async def get_employee_by_manager(req: userBase, db: Session = Depends(get_db)):
    id=req.manager_id

    employee_list=db.query(Employee).filter(Employee.manager_id == id).all()

    if not employee_list:
       raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for employee in employee_list:
        result_list.append({
            "id":  employee.empid,
            "name": employee.name,
            "role": employee.role,
        })
    
    return result_list 

class addProjectBase(BaseModel):
    employee_id: int
    project_id: int

@app.post("/addEmployeeProjects")
async def add_employee_projects(req: addProjectBase, db: Session = Depends(get_db)):
    add_item = EmployeeProjects(**req.dict())

    if not add_item:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    db.add(add_item)
    db.commit()
    db.refresh(add_item)
    
    return 1


@app.post("/getCommonEmployee")
async def get_common_employee(req: userBase, db: Session = Depends(get_db)):
    common_employees = db.execute(text("select distinct employee_id from employeeProjects where project_id in (select project_id from employeeProjects where employee_id= :user1) and employee_id!= :user2"), {'user1': req.emp_id, "user2": req.emp_id}).fetchall()

    if not common_employees:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    result_list = []
    for employee in common_employees:
        result_list.append({
            "id":  employee.employee_id
        })
    
    return result_list


class commonProjectBase(BaseModel):
    emp_id: int
    co_emp_id: int

@app.post("/getProjectBySelectedEmployee")
async def get_project_selected_employee(req: commonProjectBase, db: Session = Depends(get_db)):
    common_projects = db.execute(text("select distinct project_id from employeeProjects where project_id in (select project_id from employeeProjects where employee_id= :user1) and employee_id= :user2"), {'user1': req.emp_id, "user2": req.co_emp_id}).fetchall()


    if not common_projects:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    result_list = []
    for employee in common_projects:
        result_list.append({
            "project_id":  employee.project_id
        })
    
    return result_list


class addAlertBase(BaseModel):
    alt_id: Optional[int] = None
    employee_id: Optional[int] = None
    alt_type: Optional[int] = None
    alt_description: Optional[str] = None
    status: Optional[int] = None


# 1 timesheet alert
# 2 leave alert
# 3 ticket alert


@app.post("/addAlert")
async def add_alert(req: addAlertBase, db: Session = Depends(get_db)):
    add_item=Alert(**req.dict())

    if not add_item:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    db.add(add_item)
    db.commit()
    db.refresh(add_item)
    
    return 1


@app.post("/updateAlerts")
async def update_alerts(req: addAlertBase, db: Session = Depends(get_db)):
    alt_id=req.alt_id

    change_alert=db.query(Alert).filter(Alert.alt_id == alt_id).first()

    if not change_alert:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    change_alert.status=1
    
    db.commit()

    return 1


@app.post("/getAlertByEmployee")
async def get_alert_by_employee(req: userBase, db: Session = Depends(get_db)):
    
    alert_list = db.query(Alert).filter(Alert.employee_id == req.emp_id, Alert.status==0).all()

    if not alert_list:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    result_list = []
    for alert in alert_list:
        result_list.append({
            "alt_id": alert.alt_id,
            "description": alert.alt_description,
            "employee_id": alert.employee_id,
            "status": alert.status,
            "type": alert.alt_type
        })
    
    return result_list


from typing import List, Dict

class EmployeeRef(BaseModel):
    employee_id: int
    name: str
    role: str
    manager_id: int
    projects: List[int]


@app.post("/getEmployeeInfo")
def get_employees_with_projects(req: userBase, db: Session = Depends(get_db)):
    manager_id=req.manager_id
    employees = db.query(Employee).filter(Employee.manager_id == manager_id).all()
    employee_projects = []

    for emp in employees:
        projects = db.query(EmployeeProjects).filter(EmployeeProjects.employee_id == emp.empid).all()
        project_ids = [proj.project_id for proj in projects]

        # print(emp.employee_id)
        employee_info = EmployeeRef(
            employee_id=emp.empid,
            name=emp.name,
            role=emp.role,
            manager_id=emp.manager_id,
            projects=project_ids
        )

        employee_projects.append(employee_info)

    return employee_projects


# @app.post("/getEmployeeInfo")
# async def get_employee_info(req: userBase, db: Session = Depends(get_db)):
#     employee_list=db.query(Employee).filter(Employee.manager_id == req.manager_id).all()

#     if not employee_list:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
    
#     result_list = []
#     for employee in employee_list:
        
    
#     return result_list



# class EmployeeWithProjects(BaseModel):
#     employee: Employee
    

# @app.get("/employees/manager/{manager_id}", response_model=List[EmployeeWithProjects])
# def get_employees_with_projects(manager_id: int, db: Session = Depends(get_db)):
    
#     # Query to get employees with the specified manager_id
#     db.execute("SELECT * FROM employee WHERE manager_id = ?", (manager_id,))
#     employees = cursor.fetchall()

#     employee_projects = []

#     for emp in employees:
#         employee_id = emp['employee_id']
        
#         # Query to get projects for each employee
#         cursor.execute("SELECT project_id FROM employeeProject WHERE employee_id = ?", (employee_id,))
#         projects = cursor.fetchall()
#         project_ids = [proj['project_id'] for proj in projects]

#         employee_info = Employee(
#             employee_id=emp['employee_id'],
#             name=emp['name'],
#             email=emp['email'],
#             manager_id=emp['manager_id']
#         )

#         employee_projects.append(EmployeeWithProjects(employee=employee_info, projects=project_ids))

#     conn.close()
#     return employee_projects





@app.post("/pushTimesheetNotFilledAlert")
async def timesheet_not_filled_alert(req: userBase, db: Session = Depends(get_db)):

    timesheet_dates = db.execute(text("SELECT DISTINCT CONVERT(DATE, start_time)  FROM timesheet WHERE timesheet.employee_id = :user_id and CONVERT(DATE,timesheet.start_time) < CONVERT(DATE, GETDATE())"), {'user_id': req.emp_id}).fetchall()

    cnt=0
    current_date = date.today() 
    print(current_date)

    for i in timesheet_dates:
        cnt+=1

    rem_days=current_date.day

    return {"rem_days":rem_days-cnt}


