import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { AppController } from 'src/app.contoller';

describe('AppController', () =>{
    let appController: AppController;

    // const requestMock = (query:any, body: any) => {
    //     return {
    //       query: query,
    //       body: body
    //     } as unknown as Request;
    //   }

      const statusResponseMock = {
        json: jest.fn((x) => x)
      }

      const responseMock = {
          status: jest.fn((x) =>statusResponseMock),
          json: jest.fn((x) => x)
      } as unknown as Response

      const nextMock = {} as unknown as NextFunction

      beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
          controllers: [AppController],

        }).compile();

        appController = app.get<AppController>(AppController)
      });

      it('should be defined', () =>{
        expect(appController).toBeDefined();
      })

      it('should return OK status', () =>{
         appController.getHealth(responseMock, nextMock)

         expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()
      })
})
