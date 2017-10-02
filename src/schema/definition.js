const certificateManagementSchema = {
  certificates: {
    type: "object",
    patternProperties: {
      ".*": { type: "string" }
    }
  }
}

const rebootManagementSchema = {
  rebootInfo: {
    type: "object",
    additionalProperties: false,
    properties: {
      dailyRebootTime: {
        type: "string",
        format: "date-time"
      },
      singleRebootTime: {
        type: "string",
        format: "date-time"
      }
    }
  }
}

const timeInfoSchema = {
  timeInfo: {
    type: "object",
    additionalProperties: false,
    properties: {
      timeZoneDaylightBias: { type: "integer" },
      timeZoneDaylightDate: {
        type: "string",
        format: "date-time"
      },
      timeZoneDaylightName: { type: "string" },
      timeZoneStandardBias: { type: "integer" },
      timeZoneStandardDate: {
        type: "string",
        format: "date-time"
      },
      timeZoneStandardName: { type: "string" },
      timeZoneBias: { type: "integer" },
      ntpServer: {
        type: "string",
        format: "uri"
      }
    }
  }
}

const windowsUpdatePolicySchema = {
  windowsUpdatePolicy: {
    type: "object",
    additionalProperties: false,
    properties: {
      activeHoursStart: {
        type: "integer",
        minimum: 0,
        maximum: 23
      },
      activeHoursEnd: {
        type: "integer",
        minimum: 0,
        maximum: 23
      },
      allowAutoUpdate: { type: "boolean" },
      allowMUUpdateService: { type: "boolean" },
      allowNonMicrosoftSignedUpdate: { type: "boolean" },
      allowUpdateService: { type: "boolean" },
      branchReadinessLevel:  {
        type: "integer",
        minimum: 2,
        maximum: 32
      },
      deferFeatureUpdatesPeriod: {
        type: "integer",
        minimum: 0,
        maximum: 365
      },
      deferQualityUpdatesPeriod: {
        type: "integer",
        minimum: 0,
        maximum: 30
      },
      excludeWUDrivers: { type: "boolean" },
      pauseFeatureUpdates: { type: "boolean" },
      pauseQualityUpdates: { type: "boolean" },
      requireUpdateApproval: { type: "boolean" },
      scheduledInstallDay: {
        type: "integer",
        minimum: 0,
        maximum: 7
      },
      scheduledInstallTime: {
        type: "integer",
        minimum: 0,
        maximum: 23
      },
      updateServiceUrl: {
        type: "string",
        format: "uri"
      }
    }
  }
}

export const desiredPropertiesSchema = {
  type: "object",
  properties: {
    desired: {
      type: "object",
      properties: {
        microsoft: {
          type: "object",
          properties: {
            management: {
              type: "object",
              additionalProperties: false,
              properties: {
                ...certificateManagementSchema,
                ...rebootManagementSchema,
                ...timeInfoSchema,
                ...windowsUpdatePolicySchema
              }
            }
          }
        }
      }
    }
  }
};
