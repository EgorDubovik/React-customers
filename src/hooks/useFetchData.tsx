import { useState, useEffect } from 'react';
import axiosClient from '../store/axiosClient';
const useFetchData = (url:string) => {
   const [loadingStatus, setLoading] = useState('loading');
   const [data, setData] = useState<any>(null);
   useEffect(() => {
      axiosClient.get(url)
         .then((res) => {
            console.log(res.data);
            setData(res.data);

            setLoading('success');
         })
         .catch((err) => {
            setLoading('error');
            console.log(err);
         });
   }, [url]);

   return { loadingStatus, data };
}

export default useFetchData;