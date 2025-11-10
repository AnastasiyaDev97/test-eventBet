import { LocalStorageDriver } from '../lib/storage/LocalStorageDriver'
import { StorageService } from './StorageService'

export const storageService = new StorageService(new LocalStorageDriver())
