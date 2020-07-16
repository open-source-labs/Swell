import protoParser from "../src/client/protoParser";

describe("testing protoParser", () => {
  const protoFile = `syntax = 'proto3';
        
        package helloworld;
        
        // The greeting service definition.
        service Greeter {
          // Sends a greeting
          rpc SayHello (HelloRequest) returns (HelloReply) {}
          rpc SayHelloCS (stream HelloRequest) returns (HelloReply) {}
          rpc SayHellos (HelloRequest) returns (stream HelloReply) {}
          rpc SayHelloBidi (stream HelloRequest) returns (stream HelloReply) {}
        }
        
        // The request message containing the user's name.
        message HelloRequest {
          string name = 1;
        }
        
        // The response message containing the greetings
        message HelloReply {
          string message = 1;
        }
        
        // The request message containing the user's name.
        message HelloHowOldRequest {
          int32 age = 1;
        }
        message HelloAge {
          int32 age = 1;
        }`;
  describe("parser parses protos correctly", () => {
    it("should get packageName", () => {
      const parsedProto = protoParser(protoFile).then((data) => {
        expect(data.packageName).toEqual("helloworld");
      });
    });
    it("should get serviceArray", () => {
      const testArr = [
        {
          messages: [{}, {}, {}, {}],
          name: "Greeter",
          packageName: "helloworld",
          rpcs: [{}, {}, {}, {}],
        },
      ];
      const parsedProto = protoParser(protoFile).then((data) => {
        expect(data.serviceArr[0].messages).toHaveLength(4);
        expect(data.serviceArr[0].rpcs).toHaveLength(4);
        expect(data.serviceArr[0].name).toEqual("Greeter");
        expect(data.serviceArr[0].packageName).toEqual("helloworld");
      });
    });

    it("should fill message content", () => {
      const testArr = [
        {
          messages: [
            {
              name: "HelloRequest",
              def: {
                name: { type: "TYPE_STRING", nested: false, dependent: "" },
              },
            },
            {
              name: "HelloRequest",
              def: {
                name: { type: "TYPE_STRING", nested: false, dependent: "" },
              },
            },
            {
              name: "HelloRequest",
              def: {
                name: { type: "TYPE_STRING", nested: false, dependent: "" },
              },
            },
            {
              name: "HelloRequest",
              def: {
                name: { type: "TYPE_STRING", nested: false, dependent: "" },
              },
            },
          ],
          name: "Greeter",
          packageName: "helloworld",
          rpcs: [{}, {}, {}, {}],
        },
      ];
      const parsedProto = protoParser(protoFile).then((data) => {
        expect(data.serviceArr[0].messages[0]).toEqual(testArr[0].messages[0]);
        expect(data.serviceArr[0].messages[0].def.name.type).toEqual(
          "TYPE_STRING"
        );
      });
    });
  });
});
