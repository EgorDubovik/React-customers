
export const viewCurrency = (amount:number) => {
   return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
   });
}

export const calculateTaxTotal = (services:any) => {
   let tax = 0;
   let total = 0;
   services.forEach((service:any) => {
      const price = parseFloat(service.price);
      total += price;
      if(service.taxable) tax += (price * 0.0825);
   });
   total += tax;
   return {tax, total};
}
export const calculateRemaining = (payments:any, total:number) => {
   const totalPaid = payments.reduce((acc:any, payment:any) => {
      const amount = parseFloat(payment.amount);
      return acc + amount;
   }, 0);
   const remaining = total - totalPaid;
   return Math.round(remaining*100)/100;
}
export const getTechAbr = (name:string) => {
   return name.split(' ').map((n:string) => n[0]).join('');
}

export const manualIsoString = (date:Date) => {
   return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}Z`;
}