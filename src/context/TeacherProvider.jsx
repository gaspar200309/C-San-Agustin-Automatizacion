import React, { createContext, useContext, useState, useCallback } from "react";
import { getTeacher } from "../api/api";


const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDataFetched, setIsDataFetched] = useState(false); // Nueva bandera

    const fetchTeachers = useCallback(async () => {
        if (isDataFetched) return; 

        try {
            setLoading(true);
            const response = await getTeacher();
            setTeachers(response.data);
            setIsDataFetched(true); // Marca como cargados
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [isDataFetched]);

    return (
        <TeacherContext.Provider value={{ teachers, loading, error, fetchTeachers }}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeacherContext = () => useContext(TeacherContext);
