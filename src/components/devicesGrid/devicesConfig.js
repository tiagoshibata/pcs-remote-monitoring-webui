// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import lang from '../../common/lang';
import ConnectionStatusRenderer from '../cellRenderers/connectionStatusRenderer/connectionStatusRenderer';
import IsSimulatedRenderer from '../cellRenderers/isSimulatedRenderer/isSimulatedRenderer';
import { EMPTY_FIELD_VAL, DEFAULT_TIME_FORMAT, gridValueFormatters } from '../pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const DEFAULT_DEVICE_GRID_PAGE_SIZE = 50;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

/** A collection of column definitions for the devices grid */
export const deviceColumnDefs = {
  id: {
    headerName: lang.DEVICENAME,
    field: 'Id',
    sort: 'asc'
  },
  isSimulated: {
    headerName: lang.SIMULATED,
    field: 'IsSimulated',
    cellRendererFramework: IsSimulatedRenderer
  },
  deviceType: {
    headerName: lang.DEVICETYPE,
    field: 'Properties.Reported.Type',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  firmware: {
    headerName: lang.FIRMWARE,
    field: 'Properties.Reported.Firmware',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  telemetry: {
    headerName: lang.TELEMETRY,
    field: 'Properties.Reported.Telemetry',
    valueFormatter: ({ value }) => Object.keys(value || {}).join('; ') || EMPTY_FIELD_VAL
  },
  status: {
    headerName: lang.STATUS,
    field: 'Connected',
    cellRendererFramework: ConnectionStatusRenderer
  },
  errors: {
    headerName: lang.ERRORS,
    field: 'Properties.Reported.windows.errors',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  compliant: {
    headerName: lang.COMPLIANT,
    field: 'Properties.Reported.windows.applying',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  lastConnection: {
    headerName: lang.LASTCONNECTION,
    field: 'LastActivity',
    valueFormatter: ({ value }) => {
      const time = moment(value);
      return checkForEmpty((time.unix() > 0) ? time.format(DEFAULT_TIME_FORMAT) : '');
    }
  }
};

/** Given a device object, extract and return the device Id */
export const getSoftSelectId = ({ Id }) => Id;

/** Shared device grid AgGrid properties */
export const defaultDeviceGridProps = {
  enableColResize: true,
  multiSelect: true,
  pagination: true,
  paginationPageSize: DEFAULT_DEVICE_GRID_PAGE_SIZE,
  rowSelection: 'multiple'
};
