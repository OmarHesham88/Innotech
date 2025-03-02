import React from 'react';

const PrintContract = ({ contract }) => {
  return (
    <div className="hidden print:block print:p-8">
      <div className="text-right space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">{contract.contractTitle}</h1>
        
        <div className="space-y-4">
          <p className="font-semibold">الطرف الأول: {contract.firstParty}</p>
          <p className="font-semibold">الطرف الثاني: {contract.secondParty}</p>
        </div>

        <div className="my-6">
          <h2 className="font-semibold mb-2">بنود العقد:</h2>
          <p>{contract.contractTerms}</p>
        </div>

        <div className="flex justify-between mt-8">
          <p>من: {contract.from}</p>
          <p>إلى: {contract.to}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintContract;