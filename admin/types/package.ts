import { Base } from './base'

export type PackageBase = {
  id: string
  slug: string
  name: string
  latestVersion: string
  type: string
}

export type Package = PackageBase & Base

export type PackageVersionBase = {
  id: string
  packageID: string
  version: string
  vulnerabilities: string[]
}

export type PackageVersion = PackageVersionBase & Base
