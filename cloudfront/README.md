# Pensieve Cloudfront

To deploy the structure to AWS CloudFront you need this section.
Please make sure before deploy to CloudFront, that frontend and backend section is deploye (is done via BitBucket Pipeline).

NOTE: This step has to be done manually

### Why manual?

So we prevent renew certifictaes and confirmation every time.

### Deployment

1. Create a profile in `~/.aws/credentials` with the profile you are allowed to deploy, e.g. `pensieve-master`
2. Define your stage and deploy:

```shell
yarn sls deploy -s {STAGE} --profile pensieve-master --aws-profile pensieve-master
```

`{STAGE}` = development or production
