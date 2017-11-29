// Copyright (c) Microsoft. All rights reserved.
import lang from '../../common/lang';
import ConnectionStatusRenderer from '../cellRenderers/connectionStatusRenderer/connectionStatusRenderer';
import { EMPTY_FIELD_VAL, gridValueFormatters } from '../pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const DEFAULT_DEVICE_GRID_PAGE_SIZE = 50;

export const checkboxParams = {
  headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true
};

const formatObjectKeys = (object) => Object.keys(object || {}).join('; ') || EMPTY_FIELD_VAL;

/** A collection of column definitions for the devices grid */
export const deviceColumnDefs = {
  id: {
    headerName: lang.ID,
    field: 'Id',
    sort: 'asc'
  },
  name: {
    headerName: lang.NAME,
    field: 'Properties.Reported.windows.deviceInfo.name',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  model: {
    headerName: lang.MODEL,
    field: 'Properties.Reported.windows.deviceInfo.model',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  firmware: {
    headerName: lang.FIRMWARE,
    field: 'Properties.Reported.windows.deviceInfo.fwVer',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  os: {
    headerName: lang.OS_VERSION,
    field: 'Properties.Reported.windows.deviceInfo.osVer',
    valueFormatter: ({ value }) => checkForEmpty(value)
  },
  telemetry: {
    headerName: lang.TELEMETRY,
    field: 'Properties.Reported.Telemetry',
    valueFormatter: ({ value }) => formatObjectKeys(value)
  },
  status: {
    headerName: lang.STATUS,
    field: 'Connected',
    cellRendererFramework: ConnectionStatusRenderer
  },
  errors: {
    headerName: lang.ERRORS,
    field: 'Properties.Reported.errors',
    valueFormatter: ({ value }) => formatObjectKeys(value)
  },
  compliant: {
    headerName: lang.COMPLIANT,
    field: 'Properties.Reported.applying',
    valueFormatter: ({ value }) => formatObjectKeys(value)
  },
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
