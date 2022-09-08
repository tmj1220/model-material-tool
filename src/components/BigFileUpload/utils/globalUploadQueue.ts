import { RCFile } from '../index.d'

type Uri = string
type Id = string | number
interface Task {
  // eslint-disable-next-line no-unused-vars
  uploadFunc: () => void,
  file: RCFile
}
type Queue = Map<Id, Task>

class GlobalUploadQueue {
  private waitingQueueMap: Map<Uri, Queue>

  private uploadIngFileMap?: Map<Uri, RCFile>

  constructor() {
    this.waitingQueueMap = new Map()
    this.uploadIngFileMap = new Map()
  }

  getWaitSize(url: Uri) {
    const queueMap = this.waitingQueueMap.get(url)
    return !queueMap ? 0 : queueMap.size
  }

  getUploadingFile(url: Uri) {
    return this.uploadIngFileMap.get(url)
  }

  addWaiting(url: Uri, id: Id, task: Task) {
    let queueMap = this.waitingQueueMap.get(url)
    if (!queueMap) {
      queueMap = new Map()
      this.waitingQueueMap.set(url, queueMap)
    }
    if (queueMap.has(id)) {
      return
    }
    queueMap.set(id, task)
    console.log('addWaiting', id, queueMap, queueMap.size);
  }

  isNextTask(url: Uri, id: Id) {
    const queueMap = this.waitingQueueMap.get(url)
    console.log('isNextTask1', id, queueMap, this.waitingQueueMap);

    if (!queueMap || !queueMap.size) {
      return false
    }
    console.log('isNextTask2', id, queueMap.keys().next().value);
    return queueMap.keys().next().value === id
  }

  getNextTask(url: Uri) {
    const queueMap = this.waitingQueueMap.get(url)
    if (!queueMap || !queueMap.size) {
      return null
    }
    const id = queueMap.keys().next().value
    const task = queueMap.get(id)
    return task
  }

  removeWaiting(url: Uri, id: Id) {
    const queueMap = this.waitingQueueMap.get(url)
    if (queueMap) {
      queueMap.delete(id)
    }
  }

  setUploadingFile(url: Uri, file: RCFile) {
    this.uploadIngFileMap.set(url, file)
  }

  removeUploadingFile(url: Uri) {
    this.uploadIngFileMap.delete(url)
  }

  clear(url: Uri, ids?: string[]) {
    const uploadFile = this.getUploadingFile(url)
    if (uploadFile) {
      if (!ids || (ids.length && ids.some((v) => v === uploadFile.uid))) {
        this.removeUploadingFile(url)
      }
    }
    const queueMap = this.waitingQueueMap.get(url)
    if (!queueMap) {
      return
    }
    if (ids && ids.length) {
      ids.forEach((id) => {
        queueMap.delete(id)
      })
    } else {
      queueMap.clear()
    }
  }
}

export default GlobalUploadQueue
