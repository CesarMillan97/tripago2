import { useState, useEffect, useRef } from "react"

export const useFetch = (url, _options) => {
   const [data, setData ] = useState(null)
   const [ isPending, setIsPending ] = useState(false)
   const [ error, setError ] = useState(null)
   
   // use useRef to wrap an object/array argument
   // which is a useEffect dependency
   const options = useRef(_options).current

   useEffect (() => {
      const controller = new AbortController()
      const fetchData = async () => {
         setIsPending(true)

         try {
            const res = await fetch(url, { signal: controller.signal })
            if (!res.ok) {
               throw new Error(res.statusText)
            }
            const json = await res.json()

            setData(json)
            setIsPending(false)
            setError(null)

         } catch (err) {
            if (err.name === "AbortError") {
            } else {
               setIsPending(true)
               setError('Could not fetch the data')
            }
         }
      }
      fetchData()

      return () => {
         controller.abort()
      }
   }, [url, options])

   return { data, isPending, error }
}