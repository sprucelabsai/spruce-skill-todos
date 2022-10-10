import { EventFeatureListener } from '@sprucelabs/spruce-event-utils'

const listeners: EventFeatureListener[] = [
    {
        eventName: 'did-boot',
        eventNamespace: 'skill',
        version: 'v2022_10_09',
        callback: require('../../listeners/skill/did-boot.v2022_10_09.listener').default,
    },
    {
        eventName: 'add',
        eventNamespace: 'todos',
        version: 'v2022_10_08',
        callback: require('../../adding/listeners/todos/add.v2022_10_08.listener').default,
    },
]

export default listeners