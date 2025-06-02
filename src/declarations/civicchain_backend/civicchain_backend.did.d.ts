import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Announcement {
  'id' : string,
  'title' : string,
  'content' : string,
  'createdAt' : bigint,
  'isActive' : boolean,
  'targetAudience' : { 'All' : null } |
    { 'Police' : null } |
    { 'Barangay' : string },
  'author' : string,
}
export interface Location {
  'latitude' : number,
  'barangay' : string,
  'longitude' : number,
  'address' : string,
}
export interface Proposal {
  'id' : string,
  'status' : { 'Approved' : null } |
    { 'Rejected' : null } |
    { 'InProgress' : null } |
    { 'Completed' : null } |
    { 'Pending' : null },
  'title' : string,
  'votes' : Array<[string, boolean]>,
  'createdAt' : bigint,
  'barangay' : string,
  'description' : string,
  'deadline' : bigint,
  'budget' : bigint,
  'proposedBy' : string,
}
export interface Report {
  'id' : string,
  'status' : ReportStatus,
  'title' : string,
  'assignedTo' : [] | [string],
  'createdAt' : bigint,
  'isAnonymous' : boolean,
  'submittedBy' : string,
  'description' : string,
  'reportType' : ReportType,
  'updatedAt' : bigint,
  'mediaUrls' : Array<string>,
  'location' : Location,
}
export type ReportStatus = { 'UnderReview' : null } |
  { 'Submitted' : null } |
  { 'InProgress' : null } |
  { 'Escalated' : null } |
  { 'Resolved' : null };
export type ReportType = { 'Garbage' : null } |
  { 'NoiseComplaint' : null } |
  { 'StreetLight' : null } |
  { 'Corruption' : null } |
  { 'TrafficViolation' : null } |
  { 'Pothole' : null } |
  { 'Theft' : null } |
  { 'Other' : string };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : User } |
  { 'err' : string };
export interface User {
  'id' : string,
  'name' : string,
  'createdAt' : bigint,
  'role' : UserRole,
  'barangay' : [] | [string],
  'isActive' : boolean,
  'email' : string,
  'idNumber' : [] | [string],
  'passwordHash' : string,
  'department' : [] | [string],
  'phoneNumber' : string,
}
export type UserRole = { 'Police' : null } |
  { 'BarangayOfficial' : null } |
  { 'HeadPolice' : null } |
  { 'HeadBarangay' : null } |
  { 'Citizen' : null };
export interface _SERVICE {
  'assignReport' : ActorMethod<[string, string, string], Result>,
  'createAnnouncement' : ActorMethod<
    [
      string,
      string,
      string,
      { 'All' : null } |
        { 'Police' : null } |
        { 'Barangay' : string },
    ],
    Result_1
  >,
  'createProposal' : ActorMethod<
    [string, string, string, string, bigint, bigint],
    Result_1
  >,
  'getAllAnnouncements' : ActorMethod<[], Array<Announcement>>,
  'getAllProposals' : ActorMethod<[], Array<Proposal>>,
  'getAllReports' : ActorMethod<[], Array<Report>>,
  'getAllUsers' : ActorMethod<[], Array<User>>,
  'getAnnouncementsByTarget' : ActorMethod<
    [{ 'All' : null } | { 'Police' : null } | { 'Barangay' : string }],
    Array<Announcement>
  >,
  'getManilaBarangays' : ActorMethod<[], Array<string>>,
  'getPoliceStations' : ActorMethod<[], Array<string>>,
  'getProposal' : ActorMethod<[string], [] | [Proposal]>,
  'getProposalsByBarangay' : ActorMethod<[string], Array<Proposal>>,
  'getReport' : ActorMethod<[string], [] | [Report]>,
  'getReportStatsByBarangay' : ActorMethod<
    [string],
    {
      'resolved' : bigint,
      'total' : bigint,
      'submitted' : bigint,
      'inProgress' : bigint,
    }
  >,
  'getReportsByBarangay' : ActorMethod<[string], Array<Report>>,
  'getReportsByStatus' : ActorMethod<[ReportStatus], Array<Report>>,
  'getSystemInfo' : ActorMethod<
    [],
    {
      'totalAnnouncements' : bigint,
      'totalReports' : bigint,
      'totalProposals' : bigint,
      'totalUsers' : bigint,
    }
  >,
  'getUser' : ActorMethod<[string], [] | [User]>,
  'initializeTestUsers' : ActorMethod<[], undefined>,
  'login' : ActorMethod<[string, string, UserRole], Result_2>,
  'logoutUser' : ActorMethod<[], Result>,
  'registerUser' : ActorMethod<
    [
      string,
      string,
      string,
      UserRole,
      [] | [string],
      [] | [string],
      string,
      [] | [string],
    ],
    Result_1
  >,
  'setup' : ActorMethod<[], undefined>,
  'submitReport' : ActorMethod<
    [string, string, ReportType, Location, string, Array<string>, boolean],
    Result_1
  >,
  'updateReportStatus' : ActorMethod<[string, ReportStatus, string], Result>,
  'voteOnProposal' : ActorMethod<[string, string, boolean], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
