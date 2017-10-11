// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Spoiler from "./spoiler";
import lang from "../../common/lang";

import './dmWizard.css';


class DMWizard extends React.Component {
    render() {
        return (
            <div className="dmWizard">
              <p>DMWizard</p>
              <Spoiler name={lang.APPLICATION_MANAGEMENT}>
                <p>Application management properties</p>
              </Spoiler>
            </div>
        );
    }
}

export default DMWizard;
