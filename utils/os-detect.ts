/**
 * Util function to detect the OS
 */
export const getOsName = () => {
  let os = 'Windows';
  const userAgent = navigator.userAgent;
  const appVersion = navigator.appVersion;
  const osTypeLists = [
    {
      name: 'Windows',
      reg: /(Windows 10.0|Windows NT 10.0|Windows 8.1|Windows NT 6.3|Windows 8|Windows NT 6.2|Windows 7|Windows NT 6.1|Windows NT 6.0|Windows NT 5.2|Windows NT 5.1|Windows XP|Windows NT 5.0|Windows 2000|Win 9x 4.90|Windows ME|Windows 98|Win98|Windows 95|Win95|Windows_95|Windows NT 4.0|WinNT4.0|WinNT|Windows NT|Windows CE|Win16)/
    },
    { name: 'Windows', reg: /(Mobile|mini|Fennec|Android|iP)/ }, // mobile browsers
    { name: 'Linux', reg: /(Linux|X11)/ },
    { name: 'MacOS', reg: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/ }
  ];
  for (const id in osTypeLists) {
    const typeInfo = osTypeLists[id];
    if (typeInfo.reg.test(userAgent) || typeInfo.reg.test(appVersion)) {
      os = typeInfo.name;
      break;
    }
  }
  return os;
};
