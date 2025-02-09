import { useParams, useLocation } from "react-router-dom";

function useQueryParams(){
    const params = useParams(); //Extract route params
    const location = useLocation(); //Extract location object
    const queryParams = new URLSearchParams(location.search); //Extract query params from URL search string

    return { params, queryParams}
}

export default useQueryParams