/**
 * verb별 profile dictionary
 * + verb, activity, result extensions, context extensions로 구성
 */
export class xAPIDictionary {
    verb = [
        {
            "media": {
                "initialized": {
                    "id": "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/initialized",
                    "display": {
                        "en-US": "initialized"
                    }
                },
                "played": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/played",
                    "display": {
                        "en-US": "played"
                    }
                },
                "paused": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/paused",
                    "display": {
                        "en-US": "paused"
                    }
                },
                "seeked": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/seeked",
                    "display": {
                        "en-US": "seeked"
                    }
                },
                "completed": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/completed",
                    "display": {
                        "en-US": "completed"
                    }
                },
                "terminated": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/terminated",
                    "display": {
                        "en-US": "terminated"
                    }
                },
                "interacted": {
                    "id":  "https://ubion.co.kr/xapi/profiles/media/1.0/verbs/interacted",
                    "display": {
                        "en-US": "interacted"
                    }
                }
            }
        },
        {
            "session": {
                "logged-in": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/logged-in",
                    "display": {
                        "en-US": "logged-in"
                    }
                },
                "logged-out": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/logged-out",
                    "display": {
                        "en-US": "logged-out"
                    }
                },
                "timed-out": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/timed-out",
                    "display": {
                        "en-US": "timed-out"
                    }
                },
                "paused": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/paused",
                    "display": {
                        "en-US": "paused"
                    }
                },
                "resumed": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/resumed",
                    "display": {
                        "en-US": "resumed"
                    }
                },
                "attempted": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/attempted",
                    "display": {
                        "en-US": "attempted"
                    }
                },
                "entered": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/entered",
                    "display": {
                        "en-US": "entered"
                    }
                },
                "leaved": {
                    "id": "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/leaved",
                    "display": {
                        "en-US": "leaved"
                    }
                },
                "attended": {
                    "id":  "https://ubion.co.kr/xapi/profiles/session/1.0/verbs/attended",
                    "display": {
                        "en-US": "attended"
                    }
                }
            }
        },
        {
            "navigation": {
                "moved-to": {
                    "id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/moved-to",
                    "display": {
                        "en-US": "moved-to"
                    }
                },
                "next": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/next",
                    "display": {
                        "en-US": "next"
                    }
                },
                "previous": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/previous",
                    "display": {
                        "en-US": "previous"
                    }
                },
                "clicked": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/clicked",
                    "display": {
                        "en-US": "clicked"
                    }
                },
                "viewed": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/viewed",
                    "display": {
                        "en-US": "viewed"
                    }
                },
                "popped-up": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/popped-up",
                    "display": {
                        "en-US": "popped-up"
                    }
                },
                "opened": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/opened",
                    "display": {
                        "en-US": "opened"
                    }
                },
                "closed": {
                    "id":  "https://ubion.co.kr/xapi/profiles/navigation/1.0/verbs/closed",
                    "display": {
                        "en-US": "closed"
                    }
                }
            }
        }
    ]
    activityNames = [
        {
            "media": {
                "video": {
                    "type": "https://ubion.co.kr/xapi/activity-type/video", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/video/info"
                },
                "audio": {
                    "type": "https://ubion.co.kr/xapi/activity-type/audio", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/audio/info"
                }
            }
        },
        {
            "session": {
                "software-application": {
                    "type": "https://ubion.co.kr/xapi/activity-type/software-application", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/software-application/info"
                },
                "group-activity": {
                    "type": "https://ubion.co.kr/xapi/activity-type/group-activity", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/group-activity/info"
                }
            }
        },
        {
            "navigation": {
                "document": {
                    "type": "https://ubion.co.kr/xapi/activity-type/document", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/document/info"
                },
                "webpage": {
                    "type": "https://ubion.co.kr/xapi/activity-type/webpage", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/webpage/info"
                },
                "menu": {
                    "type": "https://ubion.co.kr/xapi/activity-type/menu", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/menu/info"
                },
                "toc": {
                    "type": "https://ubion.co.kr/xapi/activity-type/toc", 
                    "moreInfo": "https://ubion.co.kr/xapi/activity-type/toc/info"
                }
            }
        }
    ]
    extensions = {
        "result": [
            {
                "media": {
                    "time": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time",
                    "time-from": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-from",
                    "time-to": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/time-to",
                    "progress": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/progress",
                    "played-segments": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/result/played-segments"
                }
            },
            {
                "session": {
                    "attempt-count": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attempt-count",
                    "attended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-time",
                    "attended-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/attended-reason",
                    "leaved-reason": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/result/leaved-reason"
                }
            },
            {
                "navigation": {
                    "current-index": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/current-index",
                    "total-index": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/total-index",
                    "view-started-time": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-started-time",
                    "view-ended-time": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/result/view-ended-time"
                }
            }
        ],
        "context": [
            {
                "media": {
                    "media-session-id": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/media-session-id",
                    "cc-subtitle-enabled": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subtitle-enabled",
                    "cc-subtitle-lang": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/cc-subbtitle-lang",
                    "frame-rate": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/frame-rate",
                    "full-screen": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/full-screen",
                    "quality": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/quality",
                    "screen-size": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/screen-size",
                    "video-playback-size": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/video-playback-size",
                    "speed": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/speed",
                    "track": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/track",
                    "user-agent": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/user-agent",
                    "volume": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/volume",
                    "length": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/length",
                    "completion-threshold": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/completion-threshold",
                    "tag": "https://ubion.co.kr/xapi/profiles/media/1.0/extensions/context/tag"
                }
            },
            {
                "session": {
                    "session-id": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/session-id",
                    "started-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/started-time",
                    "ended-time": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ended-time",
                    "user-agent": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/user-agent",
                    "ip-address": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/ip-address",
                    "host": "https://ubion.co.kr/xapi/profiles/session/1.0/extensions/context/host"
                }
            },
            {
                "navigation": {
                    "target-id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-id",
                    "target-type": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-type",
                    "target-name": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/target-name",
                    "referrer-id": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-id",
                    "referrer-type": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-type",
                    "referrer-name": "https://ubion.co.kr/xapi/profiles/navigation/1.0/extensions/context/referrer-name"
                }
            }
        ]
    }
}