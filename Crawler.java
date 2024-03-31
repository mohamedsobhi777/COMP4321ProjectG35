import java.io.IOException;
import java.util.*;

import org.htmlparser.beans.FilterBean;
import org.htmlparser.beans.StringBean;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.AndFilter;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.tags.LinkTag;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;
import org.htmlparser.beans.LinkBean;
import java.net.URL;
import java.util.Arrays;
import org.bson.Document;
import org.bson.types.ObjectId;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.InsertOneResult;
import static com.mongodb.client.model.Filters.eq;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.net.URL;
import java.net.URLConnection;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;


public class Crawler {
    private Queue<String> urlQueue = new LinkedList<>(); //urlQueue(Queue): Storing the URL to be crawled
    private HashSet urlSet = new HashSet<String>(); //urlSet: Storing the URL explored
    private static int crawlDepth = 0;  //Total of number of web pages to be crawled


    // Format the date and time
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private String formattedDateTime = LocalDateTime.now().format(formatter);

    //Data member for interacting with the database
    private static final String uri = testProgram.database;
    private MongoClient mongoClient = MongoClients.create(uri);
    private MongoDatabase database = mongoClient.getDatabase("COMP4321");
    private MongoCollection<Document> pageInfo = database.getCollection("pageInfo");
    public Crawler(String initialUrl, int crawlDepth){    //Constructor
        this.crawlDepth = crawlDepth;
        if(!initialUrl.isEmpty()){
            urlQueue.add(initialUrl);
        }
    }

    public void extractLinks() throws ParserException, IOException {
        Vector<String> linkExtracted = new Vector<String>();  //Vector storing the url extracted
        LinkBean lb = new LinkBean();                         //Create the LinkBean object
        int numFileCrawled = 0;                               //Number of file used


        while(urlQueue.peek() != null && numFileCrawled < crawlDepth) {
            String currentRetrievedURL = urlQueue.poll();               //URL to crawl
            lb.setURL(currentRetrievedURL);                             //Set the url of the LinkBean
            URL[] urlArray = lb.getLinks();                             //Get the links from the url
            String[] urlStringArray = new String[urlArray.length];      //Change the url to strings
            for(int i = 0; i < urlArray.length; i++){                   //Add them to the url queue
                urlStringArray[i] = urlArray[i].toString();
                urlQueue.add(urlStringArray[i]);
            }
            if(!urlSet.contains(currentRetrievedURL)){
                numFileCrawled++;
                urlSet.add(currentRetrievedURL);
                linkExtracted.add(currentRetrievedURL);
            }
            if(pageInfo.countDocuments(new Document("_id", currentRetrievedURL)) == 0){  //Check if the currentRetrievedURL is in the db or not
                StringBean sb = new StringBean();                           //Create the StringBean object
                sb.setURL(currentRetrievedURL);                             //Set the url of the StringBean
                sb.setLinks(false);                                         //Should not crawl the links
                StringTokenizer st = new StringTokenizer(sb.getStrings());
                Vector<String> wordExtracted = new Vector<String>();
                while(st.hasMoreTokens()){
                    wordExtracted.add(st.nextToken());
                }

                FilterBean fb = new FilterBean();                          //Create the FilterBean object
                fb.setURL(currentRetrievedURL);                            //Set the url for the FilterBean
                fb.setFilters(new NodeFilter[]{new TagNameFilter("Title")});    //Want to crawl the element inside <title> tag

                URL url = new URL(currentRetrievedURL);                         //Get the last modified date of the web page
                URLConnection connection = url.openConnection();
                String lastModified = connection.getHeaderField("Last-Modified");
                if(lastModified == null){
                    lastModified = connection.getDate() + "";
                }

                pageInfo.insertOne(new Document()                               //Insert into the mongoDB database
                        .append("Title", fb.getText())
                        .append("_id", currentRetrievedURL)
                        .append("lastModifiedDate", lastModified)
                        .append("PageSize", wordExtracted.size())
                        .append("LastCrawledDate", formattedDateTime)
                        .append("ChildLink", Arrays.asList(urlStringArray)));;

                Indexer pageIndexer = new Indexer(currentRetrievedURL);
                pageIndexer.extractWords();

                try{
                    FileWriter writer = new FileWriter("spider_result.txt");
                    //Outputting of the crawling result
                    writer.write(currentRetrievedURL);
                    writer.write(fb.getText());
                    writer.write(lastModified+ ", " + wordExtracted.size());

                    // Write the word frequencies to the file
                    StringBuilder frequencyBuilder = new StringBuilder();
                    for (Map.Entry<String, Posting> entry : pageIndexer.combinedFrequencyMap.entrySet()) {
                        frequencyBuilder.append(entry.getKey()).append(" ").append(entry.getValue().getTermFrequency()).append("; ");
                    }
                    writer.write(frequencyBuilder.toString().trim());

                    for(int i = 0; i <urlStringArray.length && i < 10; i++){
                        writer.write("Child " + urlStringArray[i]);
                    }
                    writer.write("---------------------------------");
                    writer.flush();
                    writer.close();
                }catch (IOException e){
                    System.out.println("An error occurred.");
                    e.printStackTrace();
                }



                // Print the crawling result
//                System.out.println(fb.getText());
//                System.out.println(currentRetrievedURL);
//                System.out.println(lastModified + ", " + wordExtracted.size());

//                Print the word frequencies
//                StringBuilder frequencyBuilder = new StringBuilder();
//                for (Map.Entry<String, Posting> entry : pageIndexer.combinedFrequencyMap.entrySet()) {
//                    frequencyBuilder.append(entry.getKey()).append(" ").append(entry.getValue().getTermFrequency()).append("; ");
//                }
//                System.out.println(frequencyBuilder.toString().trim());
//
//                for (int i = 0; i < urlStringArray.length && i < 10; i++) {
//                    System.out.println("Child " + urlStringArray[i]);
//                }
//                System.out.println("---------------------------------");
            }


        }

    }
    public static void main (String[] args)
    {
        try
        {
            String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";
            Crawler crawler = new Crawler(testURL, 30);

            crawler.extractLinks();

        } catch (ParserException | IOException e)
        {
            e.printStackTrace ();
        }

    }


}
