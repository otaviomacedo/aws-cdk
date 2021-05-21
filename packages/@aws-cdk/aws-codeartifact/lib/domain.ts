import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomain } from './codeartifact.generated';

/**
 * TODO Add documentation
 */
export interface IDomain extends IResource {
  /**
   * The ARN of the domain
   * @attribute
   */
  readonly domainArn: string;

  /**
   * The name of the domain
   * @attribute
   */
  readonly domainName: string;

  /**
   * External KMS key to use for encryption of the artifacts in the domain.
   *
   * @default key is managed by KMS.
   * @attribute
   */
  readonly domainEncryptionKey: string;

  /**
   * A policy document that specifies which actions other AWS
   * accounts and organizations can perform on your domain.
   *
   * @default an empty policy
   * @attribute
   */
  readonly permissionsPolicyDocument?: iam.PolicyDocument;

  /**
   * The 12-digit account number of the AWS account that owns the domain that
   * contains the repository. It does not include dashes or spaces.
   *
   * @attribute
   */
  readonly domainOwner: string;
}

/**
 * TODO Add documentation
 */
export interface DomainProps {
  /**
   * The name of the domain
   */
  readonly domainName: string;

  /**
   * External KMS key to use for encryption of the artifacts in the domain.
   *
   * @default key is managed by KMS.
   */
  readonly domainEncryptionKey?: kms.IKey,

  /**
   * A policy document that specifies which actions other AWS
   * accounts and organizations can perform on your domain.
   *
   * @default an empty policy
   */
  readonly permissionsPolicyDocument?: iam.PolicyDocument,
}

/**
 * TODO Add documentation
 */
export abstract class DomainBase extends Resource implements IDomain {
  public abstract readonly domainArn: string;
  public abstract readonly domainName: string;
  public abstract readonly domainEncryptionKey: string;
  public abstract readonly domainOwner: string;

  // TODO Should we implement a `addResourceToPolicy`?
}

/**
 * TODO Add documentation
 */
export class Domain extends DomainBase {

  /**
   * TODO Implement this or any other fromXxx method
   * @param scope TODO
   * @param id TODO
   * @param domainArn TODO
   */
  public static fromDomainArn(scope: Construct, id: string, domainArn: string): IDomain {
    const parts = Stack.of(scope).parseArn(domainArn);

    class Import extends DomainBase {
      public domainName = parts.resourceName || '';
      public domainArn = domainArn;
      readonly encryptionKey = 'TODO';
      readonly owner = 'TODO';
      readonly domainEncryptionKey = 'TODO';
      readonly domainOwner = 'TODO';
    }

    return new Import(scope, id);
  }

  public readonly domainArn: string;
  public readonly domainName: string;
  public readonly domainEncryptionKey: string;

  public readonly domainOwner: string;
  // TODO Implement this or some other fromXxx method


  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id); // TODO Should we pass any props here?

    const resource = new CfnDomain(this, 'Resource', {
      domainName: props.domainName,
      encryptionKey: props.domainEncryptionKey?.keyArn,
      permissionsPolicyDocument: props.permissionsPolicyDocument,
    });

    this.domainArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'codeartifact',
      resource: 'domain',
      resourceName: this.physicalName,
    });

    this.domainName = props.domainName;
    this.domainEncryptionKey = resource.attrEncryptionKey; // TODO Is this correct?
    this.domainOwner = resource.attrOwner; // TODO Is this correct?
  }
}