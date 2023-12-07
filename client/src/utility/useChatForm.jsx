import {useState} from 'react';

export const useChatForm = (initialState = {}) => {

    const [values, setValues] = useState(initialState);

    const onUrlChange = (e) => {
        setValues({...values, openurl : e.target.value} )
    }


    return {
        onUrlChange,
        values
    }
}