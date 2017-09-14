// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ProfileEditor from './profileEditor';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import lang from "../../common/lang";

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<ProfileEditor />);
});

it('renders top div', () => {
  const wrapper = mount(<ProfileEditor />);
  expect(wrapper.find('.profileEditorTile')).toHaveLength(1);
});

it('builds a property twin', () => {
  const profileEditor = new ProfileEditor();
  expect(profileEditor.buildPropertyTwin([
    {Key: 'stringKey', Value: 'abc', Type: 'String'},
    {Key: 'numberKey', Value: '14', Type: 'Number'},
    {Key: 'booleanKey', Value: 'yes', Type: 'Boolean'},
  ])).toEqual({'stringKey': 'abc', 'numberKey': 14, 'booleanKey': true});
});

it('fails with invalid property twins', () => {
  const profileEditor = new ProfileEditor();
  expect(profileEditor.buildPropertyTwin([
    {Key: 'numberKey', Value: 'a', Type: 'Number'},
  ])).toEqual(lang.PROFILE.NUMBER_PARSE_ERROR + ": numberKey = a");
  expect(profileEditor.buildPropertyTwin([
    {Key: 'booleanKey', Value: 'a', Type: 'Boolean'},
  ])).toEqual(lang.PROFILE.BOOLEAN_PARSE_ERROR + ": booleanKey = a");
});
