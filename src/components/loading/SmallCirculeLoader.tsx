
export const SmallDangerLoader = (props:any) => {
   const className = props.className || '';
   return (
      <span className={"animate-spin border-2 border-danger border-l-transparent rounded-full w-5 h-5 inline-block  m-auto "+className}></span>
   );
}
// export default {SmallDangerLoader};

export const SmallPrimaryLoader = (props:any) => {
   const className = props.className || '';
   return (
      <span className={"animate-spin border-2 border-primary border-l-transparent rounded-full w-5 h-5 inline-block  m-auto "+className}></span>
   );
}
// export default {SmallPrimaryLoader};