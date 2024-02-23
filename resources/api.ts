import axios from 'axios';
import { DtoCreateCareer, DtoCreateCourse, DtoCreateCurricular, DtoCreateModule, DtoCreateRegister, DtoCreateRoom, DtoCreateStudent, DtoCreateSubModuleWithRooms, DtoEditCareer, DtoEditCourse, DtoEditCourseName, DtoEditCurricular, DtoEditModule, DtoEditRoom, DtoEditSubRoomNameAndScore, DtoEditSubRoom, DtoFilterReport, DtoEditRegister, DtoCreateTeacher, DtoCreateRequest, DtoEditRequestAdmin, DtoEditTeacher, DtoUpdateAttendance, DtoFilterAdmissions, DtoUpdateRegister, DtoCreateModuleSystem, DtoCreateRole, ResponseAttendancesBySubRoomId } from './types';
import { saveAs } from 'file-saver';
import { Permission, User } from '@prisma/client';

export const instanceAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
})

export default abstract class API {

    static async getModules() {
        try {
            const res = await instanceAxios.get(`/module`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRequestForAdmin() {
        try {
            const res = await instanceAxios.get(`/request/admin`);
            return res.data

        } catch (error: any) {
            console.log(error)
            return []
        }
    }

    static async getStudents() {
        try {
            const res = await instanceAxios.get(`/student`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCareers() {
        try {
            const res = await instanceAxios.get(`/career`);
            return res.data
            // return await res.json();
        } catch (error: any) {
            console.log(error);
        }
    }
    static async getCurriculars() {
        try {
            const res = await instanceAxios.get(`/curricular`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCourses(moduleId: number) {
        try {
            const res = await instanceAxios.get(`/course/bymoduleid/${moduleId}`)
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRegisters() {
        try {
            const res = await instanceAxios.get('/register');
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getTeachers() {
        try {
            const res = await instanceAxios.get('/teacher');
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRoomsByCareer(careerId: number) {
        try {
            const res = await instanceAxios.get(`/room/bycourseid/${careerId}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRegisterById(byid: number) {
        try {
            const res = await instanceAxios.get(`/register/${byid}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRegisterByIdToEnrollment(byId: number) {
        try {
            const res = await instanceAxios.get(`/register/enrollment/${byId}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCurricularsByCareerId(careerId: number) {
        try {
            const res = await instanceAxios.get(`/curricular/bycareerid/${careerId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRoomsByCourseId(courseId: number) {
        try {
            const res = await instanceAxios.get(`/room/bycourseid/${courseId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getModulesByCurricularId(curricularId: number) {
        try {
            const res = await instanceAxios.get(`/module/bycurricularid/${curricularId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async fetchRoles() {
        try {
            const res = await instanceAxios.get(`/role/list`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async fetchUsers() {
        try {
            const res = await instanceAxios.get(`/user/list`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async fetchModulesSystem() {
        try {
            const res = await instanceAxios.get(`/ms/list`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async fetchAdmissionsByAdmission(admission: string) {
        try {
            const res = await instanceAxios.get(`/admission/${admission}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async fetchGetAttendancesBySubRoomId(registerId : number ,subRoomId: number) : Promise<ResponseAttendancesBySubRoomId> {
        try {
            const res = await instanceAxios.get(`/register/${registerId}/attendance/${subRoomId}`);
            return res.data as ResponseAttendancesBySubRoomId

        } catch (error: any) {
            console.log(error)
            return {} as ResponseAttendancesBySubRoomId
        }
    }
    static async postFilterAdmissions(filters : DtoFilterAdmissions) {
        try {
            const res = await instanceAxios.post(`/admission/filter`,filters);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    // POST
    static async postReport(params: DtoFilterReport) {
        try {
            const res = await instanceAxios.post(`/report`, params)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async postModuleSystem( values : DtoCreateModuleSystem) {
        try {
            const res = await instanceAxios.post(`/ms/store`, values)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async postRole( values : DtoCreateRole) {
        try {
            const res = await instanceAxios.post(`/role/store`, values)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async postCourse(newCourse: DtoCreateCourse) {
        try {
            const res = await instanceAxios.post('/course/store', newCourse);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async postCareer(newCareer: DtoCreateCareer) {
        return await instanceAxios.post('/career/store', newCareer)
    }
    static async postStudent(student: DtoCreateStudent) {
        return await instanceAxios.post('/student/store', student)
    }

    static async postTeacher(teacher: DtoCreateTeacher) {
        return await instanceAxios.post('/teacher/store', teacher)
    }

    static async postRegister(register: DtoCreateRegister) {
        return await instanceAxios.post('/register/store', register)
    }
    static async postRoom(room: DtoCreateRoom) {
        try {
            const res = await instanceAxios.post('/room/store', room);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async postSubRoom(subModuleWithRooms: DtoCreateSubModuleWithRooms) {
        try {
            const res = await instanceAxios.post('/subroom/store', subModuleWithRooms);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }

    static async postRequest(form: FormData) {
        return await instanceAxios.post('/request/store', form)
    }


    //PUT
    static async putRequestSuper(form: FormData) {
        return await instanceAxios.post('/request/super/update', form)
    }
    static async putObservationRegister(register  : DtoUpdateRegister) {
        try {
            const res = await instanceAxios.post('/register/observation', register)
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    static async putPermission(permission  : Permission) {
        try {
            const res = await instanceAxios.post('/permission/update', permission)
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    static async putUser(user  : User) {
        try {
            const res = await instanceAxios.post('/user/update', user)
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    static async putRoom(room: DtoEditRoom) {
        try {
            const res = await instanceAxios.post('/room/update', room);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putSubRoom(subRoom: DtoEditSubRoom) {
        try {
            const res = await instanceAxios.post('/subroom/update', subRoom);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putAssistanceOnSubRoom(values: DtoUpdateAttendance) {
        try {
            const res = await instanceAxios.post('/attendance/update', values);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putSubRoomNameAndScore(subRoom: DtoEditSubRoomNameAndScore) {
        return await instanceAxios.post('/subroom/updatenas', subRoom)
    }

    static async putCourseName(courseName: DtoEditCourseName) {
        return await instanceAxios.post('/course/updatename', courseName);
    }

    static async putRegister(register: DtoEditRegister) {
        return await instanceAxios.post('/register/update', register)
    }

    static async putCareer(updateCareer: DtoEditCareer) {
        return await instanceAxios.post('/career/update', updateCareer)
    }
    static async putCurricular(updateCurricular: DtoEditCurricular) {
        try {
            const res = await instanceAxios.post('/curricular/update', updateCurricular);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putModule(updateModule: DtoEditModule) {
        try {
            const res = await instanceAxios.post('/module/update', updateModule);
            return res.data
        } catch (error: any) {
            console.log(error)
        }
    }


    static async putTeacher(updateTeacher: DtoEditTeacher) {
        try {
            const res = await instanceAxios.post('/teacher/update', updateTeacher);
            return res.data
        } catch (error: any) {
            console.log(error)
            return error
        }
    }

    static async putCourse(updateCourse: DtoEditCourse) {
        try {
            const res = await instanceAxios.post('/course/update', updateCourse);
            return res.data
        } catch (error: any) {
            console.log(error)
        }
    }

    static async putRequestAdmin(request: DtoEditRequestAdmin) {
        console.log({request})
        return await instanceAxios.post('/request/admin/update', request)
    }
    static async postCurricular(newCurricular: DtoCreateCurricular) {
        try {
            const res = await instanceAxios.post('/curricular/store', newCurricular);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async postModule(newModule: DtoCreateModule) {
        try {
            const res = await instanceAxios.post('/module/store', newModule);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }


    static async downloadDocumentById(fileId : string , extension : string,fileName : string){
        try {
            const res = fetch("/api/request/download",{
                headers:{
                    'Content-Type' : 'application/json'
                },
                method : "post",
                body : JSON.stringify({ fileId , extension})
            })
            const status = (await res).status
            const blob =  await (await res).blob()
            if(status < 500){
                saveAs(blob , `${fileName}.${extension.toLowerCase()}`)
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            return false
        }

    }

}
