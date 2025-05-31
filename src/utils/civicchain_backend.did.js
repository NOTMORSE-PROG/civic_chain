export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'HeadBarangay' : IDL.Null,
    'Citizen' : IDL.Null,
    'HeadPolice' : IDL.Null,
    'Police' : IDL.Null,
    'BarangayOfficial' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'barangay' : IDL.Opt(IDL.Text),
    'isActive' : IDL.Bool,
    'email' : IDL.Text,
    'role' : UserRole,
    'department' : IDL.Opt(IDL.Text),
    'createdAt' : IDL.Int,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ReportType = IDL.Variant({
    'Theft' : IDL.Null,
    'Pothole' : IDL.Null,
    'Corruption' : IDL.Null,
    'StreetLight' : IDL.Null,
    'TrafficViolation' : IDL.Null,
    'Garbage' : IDL.Null,
    'NoiseComplaint' : IDL.Null,
    'Other' : IDL.Text,
  });
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
    'barangay' : IDL.Text,
  });
  const ReportStatus = IDL.Variant({
    'Escalated' : IDL.Null,
    'Resolved' : IDL.Null,
    'Submitted' : IDL.Null,
    'InProgress' : IDL.Null,
    'UnderReview' : IDL.Null,
  });
  const Report = IDL.Record({
    'id' : IDL.Text,
    'status' : ReportStatus,
    'title' : IDL.Text,
    'assignedTo' : IDL.Opt(IDL.Text),
    'submittedBy' : IDL.Text,
    'description' : IDL.Text,
    'updatedAt' : IDL.Int,
    'mediaUrls' : IDL.Vec(IDL.Text),
    'reportType' : ReportType,
    'location' : Location,
    'isAnonymous' : IDL.Bool,
    'createdAt' : IDL.Int,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Variant({
      'Rejected' : IDL.Null,
      'Pending' : IDL.Null,
      'Approved' : IDL.Null,
      'InProgress' : IDL.Null,
      'Completed' : IDL.Null,
    }),
    'title' : IDL.Text,
    'votes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool)),
    'description' : IDL.Text,
    'budget' : IDL.Nat,
    'barangay' : IDL.Text,
    'deadline' : IDL.Int,
    'proposedBy' : IDL.Text,
    'createdAt' : IDL.Int,
  });
  const Announcement = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'author' : IDL.Text,
    'isActive' : IDL.Bool,
    'targetAudience' : IDL.Variant({
      'All' : IDL.Null,
      'Police' : IDL.Null,
      'Barangay' : IDL.Text,
    }),
    'createdAt' : IDL.Int,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'assignReport' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result_1], []),
    'createAnnouncement' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [Result],
        [],
      ),
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Int],
        [Result],
        [],
      ),
    'getAllAnnouncements' : IDL.Func([], [IDL.Vec(Announcement)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getAllReports' : IDL.Func([], [IDL.Vec(Report)], ['query']),
    'getAllUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
    'getAnnouncementsByTarget' : IDL.Func(
        [
          IDL.Variant({
            'All' : IDL.Null,
            'Police' : IDL.Null,
            'Barangay' : IDL.Text,
          }),
        ],
        [IDL.Vec(Announcement)],
        ['query'],
      ),
    'getManilaBarangays' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getPoliceStations' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getProposal' : IDL.Func([IDL.Text], [IDL.Opt(Proposal)], ['query']),
    'getProposalsByBarangay' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Proposal)],
        ['query'],
      ),
    'getReport' : IDL.Func([IDL.Text], [IDL.Opt(Report)], ['query']),
    'getReportStatsByBarangay' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'total' : IDL.Nat,
            'submitted' : IDL.Nat,
            'resolved' : IDL.Nat,
            'inProgress' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getReportsByBarangay' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Report)],
        ['query'],
      ),
    'getReportsByStatus' : IDL.Func(
        [ReportStatus],
        [IDL.Vec(Report)],
        ['query'],
      ),
    'getSystemInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalReports' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'totalProposals' : IDL.Nat,
            'totalAnnouncements' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUser' : IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'registerUser' : IDL.Func(
        [IDL.Text, IDL.Text, UserRole, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'submitReport' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          ReportType,
          Location,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Bool,
        ],
        [Result],
        [],
      ),
    'updateReportStatus' : IDL.Func(
        [IDL.Text, ReportStatus, IDL.Text],
        [Result_1],
        [],
      ),
    'voteOnProposal' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [Result_1], []),
  });
};
export const init = ({ IDL }) => { return []; };