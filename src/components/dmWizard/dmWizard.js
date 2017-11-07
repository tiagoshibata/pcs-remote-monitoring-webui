// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Spoiler from "./spoiler";
import lang from "../../common/lang";
import WindowsUpdateWizard from "./windowsUpdate/windowsUpdateWizard";

import './dmWizard.css';


class DMWizard extends React.Component {
    render() {
        return (
            <div className="dmWizard">
              <Spoiler name={lang.APPLICATION_MANAGEMENT}>
                <p>Application management</p>
              </Spoiler>
              <Spoiler name={lang.WINDOWS_UPDATE}>
                <WindowsUpdateWizard />
              </Spoiler>
            </div>
        );
    }
}

export default DMWizard;
