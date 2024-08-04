export const SinglePageLoading = () => {
   return (
      <div className="flex justify-center items-center h-screen">
         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
   );
}

export const SinglePageErrorLoading = () => {
   return (
		<div className="w-full sm:w-1/2 m-auto mt-10 text-center">
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
				<strong className="font-bold">Oowps!</strong>
				<span className="block sm:inline">Something went wrong.</span>
				<div className="mt-6">
					Please try{' '}
					<a href="#" onClick={() => window.location.reload()} className="underline">
						reload this page
					</a>
					.
				</div>
			</div>
		</div>
	);
}