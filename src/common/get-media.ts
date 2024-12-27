import { env } from "process";

export function getMediaUrl(name: string) {
  const s3Endpoint = env.S3_ENDPOINT ?? "";
  let endPointDomainName = env.S3_ENDPOINT;
  let endPointProtocol = "";
  if (s3Endpoint.includes("https://")) {
    endPointDomainName = s3Endpoint.split("https://")[1];
    endPointProtocol = "https://";
  } else if (s3Endpoint.includes("http://")) {
    endPointDomainName = s3Endpoint.split("http://")[1];
    endPointProtocol = "http://";
  }
  return (
    endPointProtocol +
    env.S3_BUCKET_NAME +
    "." +
    endPointDomainName +
    "/defaultImages/" +
    name
  );
}
