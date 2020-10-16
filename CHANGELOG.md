# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.1] - 2020-10-16
### Changed
- Increased the default timeout for ContentStream.

## [2.3.0] - 2020-10-13
### Added

- [TTNinjs 1.3](https://tt.se/spec/ttninjs/ttninjs-schema_1.3.json) support

## [2.2.0] - 2020-10-07
### Added

- Support for updating existing notifications.
- Support for the `layout` parameter for `content.search()` and
  `content.stream()` endpoints.

## [2.1.0] - 2020-06-16
### Added
- Added an HTTP timeout parameter for the `Api` constructor. All API calls will
  use this timeout, except for the `content.stream()` call, which will use a
  value based on the `wait` parameter.
- Added support for search facets.
### Changed
- The `collDate` parameter is now camelCased.

## [2.0.1] - 2019-12-16
### Added
- We now export the ApiError class
### Changed
- Bug fix: the `content.stream()` call didn't respect the `last` parameter.

## [2.0.0] - 2019-12-05
### Added
- Support for associations
