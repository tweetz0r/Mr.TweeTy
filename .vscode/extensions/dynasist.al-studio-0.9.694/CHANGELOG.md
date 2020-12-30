# Change Log
All notable changes to the "AL Studio" extension will be documented in this file.

## Beta-8

**Enhancements:**
- Premium feature: AL Snapshots window to ease snaphot debugging
- Community feature: new buttons on the main toolbar. These work in context of selected application
  - Download Symbols
  - Initialize Snapshots
  - Show snapshots: this loads the standard snapshot dropdown for Community version, and the new AL Snapshots windows for Premium

**Bugfixes:**
- Various fixes for issues reported on the support portal.


## Beta-7

**Enhancements:**
- Premium feature: standard Find all references / Go to References now include results from symbol package sources
- Premium feature preview: AL Search screen that shows hits for several categories
- Codeunit Viewer / Markdown document generation enhancements

**Bugfixes**:
- Field List loading error fixes
- Opening designers from active editor via command bar now works

## Beta-6 Public Beta
**Enhancements:**
- Launch configuration handling
- Selecting multiple rows on list views
- Run button on Table/Page designer
- Initial load performance enhancements
- Codeunit viewer/Document generation processes xmldoc summaries as well

**Bugfixes**:
- Sidebar Overview did not show up properly on first load
- Page Designer fixes


## Beta-5 Public Beta
**Enhancements:**
- Table Field List: list of all fields, fieldgroups, keys for all tables within a workspace
- External API provided for other VSCode extensions
- New setting: "skipInitialScan"
  - Skip inital workspace scan on VSCode start. Scanning will occur on opening any AL Studio screen or function the requires initial scan (e.g. AL Home, Designers).
  - This is useful when opening multiple VSCode instances just for quick changes.
- Open/View Report Layout for Symbols or local files

**Bugfixes**:
- Github#11: NullReference Exception On Create Table Extension

## Beta-4 Public Beta
**Major change:**
- .NET5 upgrade of Backend service:
  - Improved performance on workspace processing

**Enhancements:**
- Definition provider to nagivate source code properties
- Transferfield ruleset definition and command line validation within workspace

**Bugfixes:**
- Github#5: Backend connection lost
- Github#6: Go to definition on a standard object: "A request has failed"
- Github#7: An unexpected error occurred invoking 'QueryDashboard' 
- Github#10: Tables Key List - Enabled property

## Beta-3 Public Beta
**Enhancements:**
- AL Home 
  - Searchbox now supports patterns and flexible text search
    - Example conditions: 10..20|42|50..55, "sal he", "sales or|purch or"
  - SubType column:
    - Table -> TableType value
    - Page -> PageType value
    - Codeunit -> SubType value
- Sidebar: leveraging VSCode 1.50 by embedding Project overview into the native sidebar

**Bugfixes:**
- Github#2: "same key has already been added" exception while loading Translations in multiroot workspaces

## Beta-2 Public Beta
**Bugfixes:**
- Translation UI stuck when no translations are defined
- License activation issues
- Table/Page/Enum editors are not updated on outside file changes.
- AL Home:
    - Removing an entry from a Scope does not work.
    - Caching is too aggressive: object list is not updated.
- Page editor:
    - Display of System parts and User Controls are not yet implemented.

## Beta-1 (v0.9.513) Public Beta
- Initial beta release

## 0.1.x Private Beta
- Initial release