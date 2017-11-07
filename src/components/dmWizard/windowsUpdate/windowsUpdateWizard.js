// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import SchemaRenderer from '../schemaRenderer';
import { desiredPropertiesSchema } from "../../../schema/definition"

const propertyNames = {
  windowsUpdates: "Approved updates GUID",
}

const targetPath = "windows.windowsUpdates";


class WindowsUpdateWizard extends React.Component {
  render() {
    return (
      <div className="windows-update-wizard">
        <SchemaRenderer propertyNames={propertyNames} rootSchema={desiredPropertiesSchema} targetPath={targetPath}>
          <form>
            Approved updates GUID: <input type="text" name="approved" /><br/>
          </form>
        </SchemaRenderer>
      </div>
    );
  }
}

export default WindowsUpdateWizard;
