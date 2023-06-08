import axios from 'axios';
import { DtoCreateCareer, DtoCreateCourse, DtoCreateCurricular, DtoCreateModule, DtoCreateRegister, DtoCreateRoom, DtoCreateStudent, DtoCreateSubModuleWithRooms, DtoEditCareer, DtoEditCourse, DtoEditCourseName, DtoEditCurricular, DtoEditModule, DtoEditRoom, DtoEditSubRoomNameAndScore, DtoEditSubRoom, DtoFilterReport, DtoEditRegister, DtoCreateTeacher, DtoCreateRequest, DtoEditRequestAdmin, DtoEditTeacher } from './types';
import { saveAs } from 'file-saver';

export const instanceAxios = axios.create({
    // baseURL: "https://brann4-registro-academico-ega-w5vqxxp9p4f5q4q-3000.githubpreview.dev/"
    baseURL : process.env.NODE_ENV == "production" ? "https://registro-academico-ega.vercel.app" : "http://localhost:3000"
})

export default abstract class API {

    static async getModules() {
        try {
            const res = await instanceAxios.get(`/api/module`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRequestForAdmin() {
        try {
            const res = await instanceAxios.get(`/api/request/admin`);
            return res.data

        } catch (error: any) {
            console.log(error)
            return []
        }
    }

    static async getStudents() {
        try {
            const res = await instanceAxios.get(`/api/student`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCareers() {
        try {
            const res = await instanceAxios.get(`/api/career`);
            return res.data
            // return await res.json();
        } catch (error: any) {
            console.log(error);
        }
    }
    static async getCurriculars() {
        try {
            const res = await instanceAxios.get(`/api/curricular`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCourses(moduleId: number) {
        try {
            const res = await instanceAxios.get(`/api/course/bymoduleid/${moduleId}`)
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRegisters() {
        try {
            const res = await instanceAxios.get('/api/register');
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getTeachers() {
        try {
            const res = await instanceAxios.get('/api/teacher');
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRoomsByCareer(careerId: number) {
        try {
            const res = await instanceAxios.get(`/api/room/bycourseid/${careerId}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getRegisterById(byid: number) {
        try {
            const res = await instanceAxios.get(`/api/register/byid/${byid}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRegisterByIdToEnrollment(byId: number) {
        try {
            const res = await instanceAxios.get(`/api/register/enrollment/${byId}`);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async getCurricularsByCareerId(careerId: number) {
        try {
            const res = await instanceAxios.get(`/api/curricular/bycareerid/${careerId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getRoomsByCourseId(courseId: number) {
        try {
            const res = await instanceAxios.get(`/api/room/bycourseid/${courseId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async getModulesByCurricularId(curricularId: number) {
        try {
            const res = await instanceAxios.get(`/api/module/bycurricularid/${curricularId}`)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    // POST
    static async postReport(params: DtoFilterReport) {
        try {
            const res = await instanceAxios.post(`/api/report`, params)
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }

    static async postCourse(newCourse: DtoCreateCourse) {
        try {
            const res = await instanceAxios.post('/api/course/store', newCourse);
            return res.data;

        } catch (error: any) {
            console.log(error)
        }
    }
    static async postCareer(newCareer: DtoCreateCareer) {
        return await instanceAxios.post('/api/career/store', newCareer)
    }
    static async postStudent(student: DtoCreateStudent) {
        return await instanceAxios.post('/api/student/store', student)
    }

    static async postTeacher(teacher: DtoCreateTeacher) {
        return await instanceAxios.post('/api/teacher/store', teacher)
    }

    static async postRegister(register: DtoCreateRegister) {
        return await instanceAxios.post('/api/register/store', register)
    }
    static async postRoom(room: DtoCreateRoom) {
        try {
            const res = await instanceAxios.post('/api/room/store', room);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async postSubRoom(subModuleWithRooms: DtoCreateSubModuleWithRooms) {
        try {
            const res = await instanceAxios.post('/api/subroom/store', subModuleWithRooms);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }

    static async postRequest(form: FormData) {
        return await instanceAxios.post('/api/request/store', form)
    }


    //PUT
    static async putRequestSuper(form: FormData) {
        return await instanceAxios.post('/api/request/super/update', form)
    }


    static async putRoom(room: DtoEditRoom) {
        try {
            const res = await instanceAxios.post('/api/room/update', room);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putSubRoom(subRoom: DtoEditSubRoom) {
        try {
            const res = await instanceAxios.post('/api/subroom/update', subRoom);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putSubRoomNameAndScore(subRoom: DtoEditSubRoomNameAndScore) {
        return await instanceAxios.post('/api/subroom/updatenas', subRoom)
    }

    static async putCourseName(courseName: DtoEditCourseName) {
        return await instanceAxios.post('/api/course/updatename', courseName);
    }

    static async putRegister(register: DtoEditRegister) {
        return await instanceAxios.post('/api/register/update', register)
    }

    static async putCareer(updateCareer: DtoEditCareer) {
        return await instanceAxios.post('/api/career/update', updateCareer)
    }
    static async putCurricular(updateCurricular: DtoEditCurricular) {
        try {
            const res = await instanceAxios.post('/api/curricular/update', updateCurricular);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async putModule(updateModule: DtoEditModule) {
        try {
            const res = await instanceAxios.post('/api/module/update', updateModule);
            return res.data
        } catch (error: any) {
            console.log(error)
        }
    }


    static async putTeacher(updateTeacher: DtoEditTeacher) {
        try {
            const res = await instanceAxios.post('/api/teacher/update', updateTeacher);
            return res.data
        } catch (error: any) {
            console.log(error)
            return error
        }
    }

    static async putCourse(updateCourse: DtoEditCourse) {
        try {
            const res = await instanceAxios.post('/api/course/update', updateCourse);
            return res.data
        } catch (error: any) {
            console.log(error)
        }
    }

    static async putRequestAdmin(request: DtoEditRequestAdmin) {
        return await instanceAxios.post('/api/request/admin/update', request)
    }
    static async postCurricular(newCurricular: DtoCreateCurricular) {
        try {
            const res = await instanceAxios.post('/api/curricular/store', newCurricular);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }
    static async postModule(newModule: DtoCreateModule) {
        try {
            const res = await instanceAxios.post('/api/module/store', newModule);
            return res.data;
        } catch (error: any) {
            console.log(error)
        }
    }


    static async downloadDocumentById(fileId : string , extension : string){
        try {
            const res = fetch("http://localhost:3000/api/request/download",{
                headers:{
                    'Content-Type' : 'application/json'
                },
                method : "post",
                body : JSON.stringify({ fileId , extension})
            })
            const status = (await res).status
            const blob =  await (await res).blob()
            if(status < 500){
                saveAs(blob , `documento.${extension.toLowerCase()}`)
                return true
            }
            return false
        } catch (error) {
            console.error(error)
            return false
        }

    }

}
