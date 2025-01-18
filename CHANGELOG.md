4.7.0 / 2025-01-18
==================
  * Support uncertain or approximate seasons at level 3
  * Support seasons with unspecified years at level 3
  * Add `seasonUncertainty` parser constraint
4.5.1 / 2023-10-16
==================
  * Use custom assert instead of node:assert;
    this makes it easy to use the ESM build in browsers.
4.4.0 / 2022-06-20
==================
  * Revert to loading JSON locale data with require
    while Rollup has no built-in support for import assertions.

4.3.0 / 2022-06-19
==================
  * Add `seasonIntervals` parser constraint
  * Use ESM import assertions to import JSON locale data

4.1.0 / 2021-08-31
==================
  * Publish as dual-package, including a CJS fallback build

4.0.0 / 2021-06-17
==================
  * Use native ESM module syntax

3.1.0 / 2020-11-06
==================
  * Support '..' affix for earlier/later in inclusive lists

3.0.0 / 2020-06-30
==================
  * Use '..' instead of '*' for open end intervals

2.8.0 / 2020-06-08
==================
  * Interpret single integer input as Unix timestamp (like native Date)
  * Interpret 5+ digit strings as Unix timestamp

2.6.0 / 2019-03-15
==================
  * Accept ISO times with missing seconds

2.5.0 / 2019-01-23
==================
  * Support timezone offset without colon
  * Support negative timezone offset with minus sign
  * Use system timezone when given time without offset

2.4.0 / 2018-11-12
==================
  * Add DateTimeFormat cache

2.2.0 / 2017-09-06
==================
  * Implement date formatting (non-standard)

2.1.0 / 2017-02-17
==================
  * Support negative masked dates
  * Support negative masked years

2.0.0 / 2016-08-17
==================
  * Rename until() -> through() [#4]
  * Add until() to return half-open intervals [#4]
  * Add support for century zero [#3]
  * Implement unspecified max/next [#2]

1.0.1 / 2016-07-07
==================
  * Fix time precision normalization [#1]

1.0.0 / 2016-05-22
==================
  * Initial Release
