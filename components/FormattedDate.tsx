import React from 'react';

const FormattedDate = ({ date }: { date: Date }) => {
  const dateObj = new Date(date);
  return (
    <div className="date flex fai-c">
      <div>{dateObj.toLocaleString()}</div>
    </div>
  );
};

export default FormattedDate;
