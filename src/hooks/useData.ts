import { Employee } from "@/models/Employee"
import { UserInput } from "@/models/UserInput"
import { useEffect, useState } from "react"

export type Query = {
    apiUrl: string,
    search_by: string
    search: string,
    sort_by: string,
    sort_order: string,
    page: number
}

function useData({apiUrl ,page, sort_by, sort_order, search, search_by}: Query){
    const [data, setData] = useState<UserInput[]>([]);
    const [lastPage, setLastPage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const getData = async () => {
        setIsLoading(true)
        const res = await fetch(`${apiUrl}?page=${page}&sort_by=${sort_by}&sort_order=${sort_order}&search_by=${search_by}&search=${search}`)
        const result = await res.json();
        if(!res.ok){
            setError(result.message)
            setIsLoading(false)
            return {data, lastPage, error, isLoading ,setData, apiUrl}
        }
        setLastPage((prev) => result.lastPage);
        setData(result.data); 
        setIsLoading(false)
    }
    useEffect(() => {
        getData();
    }, [page, sort_by, sort_order, search, search_by])

    return {data, lastPage, error, isLoading ,setData, apiUrl , getData};
}

export default useData