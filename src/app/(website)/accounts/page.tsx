import React from "react";
// import dynamic from "next/dynamic";
// const AccountContainer = dynamic(
//   () => import("./_components/accounts-container")
// );

import AccountContainer from './_components/accounts-container'

const AccountPage = () => {
  return (
    <div>
      <AccountContainer />
    </div>
  );
};

export default AccountPage;
