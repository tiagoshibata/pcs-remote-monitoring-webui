// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ProfileEditor from './profileEditor';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<ProfileEditor />);
});

it('renders top div', () => {
  const wrapper = mount(<ProfileEditor />);
  expect(wrapper.find('.profileEditorTile')).toHaveLength(1);
});
