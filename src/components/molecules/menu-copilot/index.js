import React from "react";
import { Navigation } from "@teamfabric/copilot-ui/dist/molecules";
import "./style.scss";

function Side_Nav_Copilot() {
  return (
    <div className="side_nav_copilot">
      <Navigation
        className="secondary"
        links={[
          {
            id: 1,
            label: "Items",
            url: "/",
          },
          {
            id: 2,
            label: "Attributes",
            url: "/",
          },
          {
            children: [
              {
                active: true,
                id: 1,
                label: "Master",
                url: "/",
              },
              {
                id: 2,
                label: "Published",
                url: "/",
              },
            ],
            id: 3,
            label: "Hierarchies",
            url: "/",
          },
          {
            id: 3,
            label: "Reports",
            url: "/",
          },
          {
            id: 3,
            label: "Settings",
            url: "/",
          },
        ]}
        onClick={function noRefCheck() {}}
        orientation="vertical"
      />
    </div>
  );
}

export default Side_Nav_Copilot;
