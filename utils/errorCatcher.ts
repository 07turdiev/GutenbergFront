import {toast} from "react-toastify";

export default function errorCatcher (err, thunkApi) {
    if(err.response && err.response.data && err.response.data.message){
        console.log(err.response)
        toast.error(err.response.data.message, {
            position: 'bottom-center',
            theme: 'dark',
            hideProgressBar: true
        })
        return thunkApi.rejectWithValue(err.response.data.message)
    }else{
        toast.error('Ошибка соеденинения', {
            position: 'bottom-center',
            theme: 'dark',
            hideProgressBar: true
        })
        return thunkApi.rejectWithValue('Ошибка соеденинения')
    }
}