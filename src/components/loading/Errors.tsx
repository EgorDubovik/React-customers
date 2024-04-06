export const PageLoadError = () => {
   return (
      <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
         <span className="ltr:pr-2 rtl:pl-2">
            <strong className="ltr:mr-1 rtl:ml-1">Woops!</strong>Something went wrong. Please try again or <a href="" onClick={()=>{window.location.reload(); }} className="underline">reload the page</a>
         </span>
      </div>
   )
}