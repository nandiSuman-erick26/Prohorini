"use client";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import React from "react";

// import AdminMapToolbar from "../AdminMapToolbar";
import InfrastructureAddPanel from "./childrens/InfrastructureAddPanel";
import InfrastructureEditPanel from "./childrens/InfrastructureEditPanel";
import InfrastructureViewPanel from "./childrens/InfrastructureViewPanel";

const InfrastructurePanel = () => {
  const { infraMode } = useAppSelector((state) => state.adminMap);

  // if(infraMode === "edit") return <InfrastructureEditPanel/>;
  // if(infraMode === "add") return <InfrastructureAddPanel/>;
  // return <InfrastructureViewPanel/>;

  return (
    <div className="space-y-3">
      {/* <><span className="text-sm font-bold text-center p-1">Change Map View</span> <AdminMapToolbar /></> */}
      {infraMode === "edit" && <InfrastructureEditPanel />}
      {infraMode === "add" && <InfrastructureAddPanel />}
      {infraMode === "view" && <InfrastructureViewPanel />}
    </div>
  );
};

export default InfrastructurePanel;
