import React from "react";
import PermissionCard from "./partials/PermissionsCard";
import { log } from "@/shared/utils/log";
import { getLabelForPermissionKey } from "@/shared/models/IGroup";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";

interface PermissionsTreeProps {
  data: any;
  path: string[];
  onUpdatePermission: (path: string[], value: boolean) => void;
  depth?: number; // Adding depth property
  t: (code: AppMessagesEnum) => string;
}

const PermissionsTree = ({
  t,
  data,
  path,
  onUpdatePermission,
  depth = 0, // Default value for depth
}: PermissionsTreeProps) => {
  // Check if current node has "permitted" property
  const hasPermittedProperty = typeof data?.permitted === "boolean";

  // If no data or not an object, return null
  if (!data || typeof data !== "object") return null;

  // Filter keys to process only objects (potential children)
  const childrenKeys = Object.keys(data).filter(
    (key) =>
      key !== "permitted" &&
      typeof data[key] === "object" &&
      data[key] !== null,
  );

  // If no permitted property, it's just a group of containers
  if (!hasPermittedProperty) {
    return (
      <>
        {childrenKeys.map((key) => (
          <PermissionsTree
            t={t}
            key={key}
            data={data[key]}
            path={[...path, key]}
            onUpdatePermission={onUpdatePermission}
            depth={depth} // Keeping same depth for groups without permission
          />
        ))}
      </>
    );
  }

  log("Rendering PermissionsTree for path: ", path, " with data: ", data);

  const title =
    path.length > 0
      ? getLabelForPermissionKey(t, path.join("."))
      : t(AppMessagesEnum.PERMISSIONS);

  const handleTogglePermission = (value: boolean) => {
    // Add "permitted" to path to indicate what is being changed
    onUpdatePermission([...path, "permitted"], value);
  };

  return (
    <PermissionCard
      title={title}
      isPermitted={data.permitted}
      onTogglePermission={handleTogglePermission}
      hasChildren={childrenKeys.length > 0}
      depth={depth}
    >
      {childrenKeys.map((key) => (
        <PermissionsTree
          key={key}
          data={data[key]}
          path={[...path, key]}
          onUpdatePermission={onUpdatePermission}
          depth={depth + 1} // Incrementing depth for children
          t={t}
        />
      ))}
    </PermissionCard>
  );
};

export default PermissionsTree;
