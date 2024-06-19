import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, AttributeType, ITable, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { getSuffixFromStack } from '../Utils'; // replace with the path to your file
import * as cdk from "aws-cdk-lib";


export class DataStack extends cdk.Stack {

    public readonly usersTable: Table;
    public readonly todosTable: Table;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const suffix = getSuffixFromStack(this);

// für die Userregistrierung
        this.usersTable = new Table(this, 'UsersTable', {
            partitionKey: { 
                name: 'UserID', 
                type: AttributeType.STRING 
            },
            tableName: "Users",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
               // table für die todos
        this.todosTable = new Table(this, "TodosTable", {
            tableName: "Todos",
            partitionKey: {
              name: "UserID",
              type: AttributeType.STRING,
            },
            sortKey: {
              name: "TodoID",
              type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
          });
          this.todosTable.addGlobalSecondaryIndex({
            indexName: "getTodoId",
            partitionKey: {
              name: "UserID",
              type: AttributeType.STRING,
            },
            sortKey: {
              name: "title",
              type: AttributeType.STRING,
            },
          });
        }
      }

    
