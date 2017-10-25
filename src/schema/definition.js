const appsSchema = {
  apps: {
    type: 'object',
    properties: {
      '?': {
        type: 'object',
        additionalProperties: false,
        properties: {
          'store': { type: 'boolean' },
          'nonStore': { type: 'boolean' }
        }
      }
    },
    patternProperties: {
      '.+': {
        type: 'object',
        additionalProperties: false,
        properties: {
          'pkgFamilyName': { type: 'string' },
          'version': {
            type: 'string',
            oneOf: [
              { enum: ['?', 'not installed'] },
              { pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+$' }
            ]
          },
          'startUp': {
            type: 'string',
            enum: ['none', 'foreground', 'background']
          },
          'appxSource': { type: 'string' },
          'depsSources': { type: 'string' },
          'certSource': { type: 'string' },
          'certStore': { type: 'string' }
        }
      }
    }
  }
}

const certificatesSchema = {
  certificates: {
    type: 'object',
    patternProperties: {
      '.+': { type: 'string' }
    }
  }
}

const deviceHealthAttestationSchema = {
  deviceHealthAttestation: {
    type: 'object',
    properties: {
      'Endpoint': {
        type: 'string',
        format: 'uri'
      },
      'ReportIntervalInSeconds': {
        type: 'string',
        pattern: '^[0-9]+$'
      }
    }
  }
}

const eventTracingCollectorsSchema = {
  eventTracingCollectors: {
    type: 'object',
    properties: {
      '?': {
        type: 'string',
        enum: ['detailed', 'minimal', 'none']
      }
    },
    patternProperties: {
      '.+': {
        type: 'object',
        properties: {
          reportProperties: { enum: ['yes', 'no'] },
          applyProperties: {
            oneOf: [
              { const: 'no' },
              {
                type: 'object',
                properties: {
                  traceLogFileMode: { enum: ['sequential', 'circular'] },
                  logFileSizeLimitMB: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 2048
                  },
                  logFileFolder: { type: 'string' },
                  started: { enum: ['yes', 'no'] },
                  patternProperties: {
                    '.+': {
                      type: 'object',
                      properties: {
                        traceLevel: { enum: ['critical', 'error', 'warning', 'information', 'verbose'] },
                        keywords: { type: 'string' },
                        enabled: { type: 'boolean' },
                        type: { const: 'provider' }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}

const rebootInfoSchema = {
  rebootInfo: {
    type: 'object',
    additionalProperties: false,
    properties: {
      dailyRebootTime: {
        type: 'string',
        format: 'date-time'
      },
      singleRebootTime: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
}

const timeInfoSchema = {
  timeInfo: {
    type: 'object',
    additionalProperties: false,
    properties: {
      timeZoneDaylightBias: { type: 'integer' },
      timeZoneDaylightDate: {
        type: 'string',
        format: 'date-time'
      },
      timeZoneDaylightName: { type: 'string' },
      timeZoneDaylightDayOfWeek: {
        type: 'integer',
        minimum: 0,
        maximum: 6
      },
      timeZoneStandardBias: { type: 'integer' },
      timeZoneStandardDate: {
        type: 'string',
        format: 'date-time'
      },
      timeZoneStandardName: { type: 'string' },
      timeZoneStandardDayOfWee: {
        type: 'integer',
        minimum: 0,
        maximum: 6
      },
      timeZoneBias: { type: 'integer' },
      ntpServer: {
        type: 'string',
        format: 'uri'
      }
    }
  }
}

const timeServiceSchema = {
  timeService: {
    type: 'object',
    properties: {
      enabled: { enum: ['yes', 'no'] },
      startup: { enum: ['auto', 'manual'] },
      started: { enum: ['yes', 'no'] },
      sourcePriority: { enum: ['local', 'remote'] }
    }
  }
}

const wifiSchema = {
  wifi: {
    oneOf: [
      { enum: ['no-apply-no-report', 'no-apply-yes-report'] },
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          applyProperties: {
            oneOf: [
              { const: 'no' },
              {
                type: 'object',
                patternProperties: {
                  '.+': {
                    oneOf: [
                      { const: 'uninstall' },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          'profile': { type: 'string' }
                        }
                      }
                    ]
                  }
                }
              }
            ]
          },
          reportProperties : { enum: ['yes', 'no'] }
        }
      }
    ]
  }
}

const windowsTelemetrySchema = {
  windowsTelemetry: {
    type: 'object',
    additionalProperties: false,
    properties: {
      level: { enum: ['security', 'basic', 'enhanced', 'full'] }
    }
  }
}

const windowsUpdatePolicySchema = {
  windowsUpdatePolicy: {
    oneOf: [
      { enum: ['no-apply-no-report', 'no-apply-yes-report'] },
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          applyProperties: {
            type: 'object',
            additionalProperties: false,
            properties: {
              activeHoursStart: {
                type: 'integer',
                minimum: 0,
                maximum: 23
              },
              activeHoursEnd: {
                type: 'integer',
                minimum: 0,
                maximum: 23
              },
              allowAutoUpdate: { type: 'boolean' },
              allowUpdateService: { type: 'boolean' },
              branchReadinessLevel:  {
                type: 'integer',
                minimum: 2,
                maximum: 32
              },
              deferFeatureUpdatesPeriod: {
                type: 'integer',
                minimum: 0,
                maximum: 365
              },
              deferQualityUpdatesPeriod: {
                type: 'integer',
                minimum: 0,
                maximum: 30
              },
              pauseFeatureUpdates: { type: 'boolean' },
              pauseQualityUpdates: { type: 'boolean' },
              requireUpdateApproval: { type: 'boolean' },
              scheduledInstallDay: {
                type: 'integer',
                minimum: 0,
                maximum: 7
              },
              scheduledInstallTime: {
                type: 'integer',
                minimum: 0,
                maximum: 23
              },
              ring: { enum: ['EarlyAdopter', 'Preview', 'GeneralAvailability'] },
              sourcePriority: { enum: ['local', 'remote'] }
            }
          },
          reportProperties: {
            enum: ['yes', 'no']
          }
        }
      }
    ]
  }
}

const windowsUpdatesSchema = {
  windowsUpdates: {
    type: 'object',
    additionalProperties: false,
    properties: {
      approved: { type: 'string' }
    }
  }
}

export const desiredPropertiesSchema = {
  type: 'object',
  properties: {
    windows: {
      type: 'object',
      properties: {
        ...appsSchema,
        ...certificatesSchema,
        ...eventTracingCollectorsSchema,
        ...rebootInfoSchema,
        ...timeInfoSchema,
        ...timeServiceSchema,
        ...windowsTelemetrySchema,
        ...windowsUpdatePolicySchema,
        ...windowsUpdatesSchema,
        management: {
          type: 'object',
          properties: {
            ...deviceHealthAttestationSchema,
            ...wifiSchema
          }
        }
      }
    }
  }
};
